FROM debian:bullseye-slim

ENV debian_frontend=noninteractive

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install ffmpeg -y && \
    apt-get install gpac -y && \
    mkdir /output && \
    chmod 777 -R /output

RUN useradd -g video video && \
    chown -R video. /output

USER video

WORKDIR /home/video

RUN cd /home/video
COPY ./genfiles.sh .

ENTRYPOINT [ "./genfiles.sh" ]