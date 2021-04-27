#!/usr/bin/env bash

nombres=("highest" "high" "hd" "sd" "low")
resoluciones=("1920x1080" "1920x1080" "1280x720" "848x480" "640x360")
bitrates=("3000k" "2000k" "1000k" "500k" "200k")
audioBitrates=("320k" "160k" "160k" "120k" "80k")

len=${#nombres[@]}

for (( i=0; i<$len; i++ ));
do
    ffmpeg -n -i /videohd.mp4 -s "${resoluciones[$i]}" -c:v libx264 -b:v "${bitrates[$i]}" -bf 2 -g 300 -sc_threshold 0 -c:a aac -strict experimental -b:a "${audioBitrates[$i]}" -ar 32000 "/output/out_${nombres[$i]}.mp4"
done

cd /output


fs=( )
for i in ${nombres[@]}; do
    fs+="/output/out_$i.mp4#video "
    fs+="/output/out_$i.mp4#audio "
done

MP4Box -dash 3000 -rap -profile dashavc264:onDemand ${fs[@]}


bitrates=("7400k" "5300k" "3200k" "1600k" "900k")
audioBitrates=("192k" "192k" "128k" "128k" "96k")

for (( i=0; i<$len; i++ ));
do
    ffmpeg -n -i /videohd.mp4 -c:a libmp3lame -b:a "${audioBitrates[$i]}" -ar 32000 -s "${resoluciones[$i]}" -c:v libx264 -b:v "${bitrates[$i]}" -flags -global_header -map 0 -f segment -segment_time 5 -segment_list "${nombres[$i]}.m3u8" -segment_format mpegts "/output/str${nombres[$i]}%03d.ts"
done
