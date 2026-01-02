@echo off
REM ImageMagickで白背景のダミー画像を生成
magick -size 100x100 xc:white -gravity South -pointsize 10 -fill black -annotate +0+5 "lifegamebot.bsky.social" lgbpimg\dummy.png
if errorlevel 1 (
    convert -size 100x100 xc:white -gravity South -pointsize 10 -fill black -annotate +0+5 "lifegamebot.bsky.social" lgbpimg\dummy.png
)

REM 黒背景の反転版を生成
magick -size 100x100 xc:black -gravity South -pointsize 10 -fill white -annotate +0+5 "lifegamebot.bsky.social" lgbpimg\dummy_invert.png
if errorlevel 1 (
    convert -size 100x100 xc:black -gravity South -pointsize 10 -fill white -annotate +0+5 "lifegamebot.bsky.social" lgbpimg\dummy_invert.png
)

echo Dummy images created!
