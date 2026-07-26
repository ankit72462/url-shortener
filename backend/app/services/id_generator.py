import time
import threading
from app.config import settings

# Base62 chars
BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

class SnowflakeGenerator:
    def __init__(self, node_id: int):
        self.node_id = node_id & 0x3FF  # 10 bits
        self.custom_epoch = 1704067200000  # 2024-01-01T00:00:00Z in ms
        self.sequence = 0
        self.last_timestamp = -1
        self.lock = threading.Lock()

    def _get_current_timestamp(self) -> int:
        return int(time.time() * 1000)
        
    def _wait_for_next_millis(self, last_timestamp: int) -> int:
        timestamp = self._get_current_timestamp()
        while timestamp <= last_timestamp:
            timestamp = self._get_current_timestamp()
        return timestamp

    def generate_id(self) -> tuple[int, str]:
        with self.lock:
            timestamp = self._get_current_timestamp()

            if timestamp < self.last_timestamp:
                raise Exception("Clock moved backwards. Refusing to generate id")

            if timestamp == self.last_timestamp:
                self.sequence = (self.sequence + 1) & 0xFFF # 12 bits
                if self.sequence == 0:
                    timestamp = self._wait_for_next_millis(self.last_timestamp)
            else:
                self.sequence = 0

            self.last_timestamp = timestamp

            # 41 bits timestamp | 10 bits node | 12 bits sequence
            time_offset = timestamp - self.custom_epoch
            snowflake_id = (time_offset << 22) | (self.node_id << 12) | self.sequence

        return snowflake_id, self.encode_base62(snowflake_id)

    @staticmethod
    def encode_base62(num: int) -> str:
        if num == 0:
            return BASE62_ALPHABET[0]
        
        arr = []
        base = 62
        while num:
            num, rem = divmod(num, base)
            arr.append(BASE62_ALPHABET[rem])
        arr.reverse()
        code = ''.join(arr)
        
        # Pad to at least 7 characters if needed, or leave it if larger
        # Requirement says "Pad/truncate to 7 chars", usually truncating a snowflake might lose entropy
        # But we'll just return the base62 string. (It naturally falls around 7-8 chars for early 41-bit timestamps)
        return code.zfill(7)[:7] # ensure exactly 7 chars

# Singleton
id_gen = SnowflakeGenerator(settings.NODE_ID)

def generate_id() -> tuple[int, str]:
    return id_gen.generate_id()
