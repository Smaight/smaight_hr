# 1. 베이스 이미지 선택 (Ubuntu 24.04 LTS)
FROM ubuntu:24.04

# 2. 시스템 패키지 및 파이썬, 빌드 도구, 한글(HWP) 관련 패키지 설치
RUN apt-get update && \
    apt-get install -y python3 python3-pip libreoffice python3.12-venv git build-essential python3-dev libxml2-dev libxslt1-dev zlib1g-dev && \
    apt-get clean

# 3. 가상환경 생성 및 pip 업그레이드
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip

# 4. 가상환경 PATH 등록
ENV PATH="/opt/venv/bin:$PATH"

# 5. 파이썬 라이브러리 설치
RUN pip install PyPDF2 python-docx

# zlib은 표준 포함이지만, 시스템 패키지로도 추가 (빌드 문제 예방)
RUN apt-get update && \
    apt-get install -y zlib1g-dev && \
    apt-get clean

# olefile 설치
# RUN pip install --no-cache-dir olefile

# 파이썬 패키지 설치
RUN pip3 install --no-cache-dir \
    PyPDF2 \
    python-docx \
    openpyxl \
    xlrd \
    python-pptx \
    olefile



# 7. 작업 디렉토리 생성
WORKDIR /app

# 8. 소스 코드 복사 (필요시)
COPY main.py /app



# 9. 기본 실행 명령 (예시)
# CMD ["python3", "main.py"]
