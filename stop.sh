sudo kill -9 $(lsof -i :8000 | grep -Eo '[0-9]{4,5}' | head -1)
