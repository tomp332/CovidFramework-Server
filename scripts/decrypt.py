import os
import json
import base64
import sqlite3
import win32crypt
import sys
from Crypto.Cipher import AES
import shutil


def get_master_key():
    with open(os.environ['USERPROFILE'] + os.sep + r'AppData\Local\Google\Chrome\User Data\Local State', "r", encoding='utf-8') as f:
        local_state = f.read()
        local_state = json.loads(local_state)
    master_key = base64.b64decode(local_state["os_crypt"]["encrypted_key"])
    print(len(master_key))
    master_key = master_key[5:]  # removing DPAPI
    master_key = win32crypt.CryptUnprotectData(master_key, None, None, None, 0)[1]
    return master_key


def decrypt_payload(cipher, payload):
    return cipher.decrypt(payload)


def generate_cipher(master_key, iv):
    return AES.new(master_key, AES.MODE_GCM, iv)


def decrypt_password(encrypted_password, master_key):
    try:
        iv = encrypted_password[3:15]
        payload = encrypted_password[15:]
        cipher = generate_cipher(master_key, iv)
        decrypted_pass = decrypt_payload(cipher, payload)
        decrypted_pass = decrypted_pass[:-16].decode()  # remove suffix bytes
        return decrypted_pass
    except:
        return "Unknown"



if __name__ == '__main__':

    hex = sys.argv[1]
    password = bytes.fromhex(hex)
    hex = sys.argv[2]
    key = bytes.fromhex(hex)
    password = decrypt_password(password, key)
    print(password)