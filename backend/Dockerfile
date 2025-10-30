# 1. 베이스 이미지 선택 (파이썬 3.10 버전)
FROM python:3.10-slim

# 2. 환경 변수 설정 (파이썬이 버퍼 없이 즉시 로그를 출력하도록)
ENV PYTHONUNBUFFERED=1

# 3. 컨테이너(가상 공간) 내부의 작업 폴더 설정
WORKDIR /app

# 4. (빌드 속도 최적화) requirements.txt 파일만 먼저 복사
COPY requirements.txt .

# 5. 라이브러리 설치
# (psycopg2-binary가 PostgreSQL과 통신하는 데 필요한 도구 설치)
RUN apt-get update && apt-get install -y postgresql-client \
    && pip install --upgrade pip \
    && pip install -r requirements.txt

# 6. 나머지 백엔드 코드 전체를 작업 폴더로 복사
COPY . .

# 7. (Gunicorn이 이 포트를 사용할 예정임을 알림)
EXPOSE 8000


# 8. 컨테이너가 시작될 때 실행할 기본 명령어
CMD ["python", "-m", "gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi"]