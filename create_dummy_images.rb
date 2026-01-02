#!/usr/bin/env ruby

# ダミー画像生成スクリプト

require 'rmagick'

def create_dummy_image(filename, bg_color, text_color, text)
  width = 100
  height = 100
  font_size = 12
  
  img = Magick::Image.new(width, height) { self.background_color = bg_color }
  
  # テキスト描画
  draw = Magick::Draw.new
  draw.font = './font/mplus-2m-bold.ttf'
  draw.pointsize = font_size
  draw.fill = text_color
  draw.gravity = Magick::SouthGravity
  draw.annotate(img, 0, 0, 0, 5, text) do
    self.align = Magick::CenterAlign
  end
  
  img.write(filename)
  puts "Created: #{filename}"
end

# 通常版（白背景、黒文字）
create_dummy_image(
  './lgbpimg/dummy.png',
  'white',
  'black',
  'lifegamebot.bsky.social'
)

# 反転版（黒背景、白文字）
create_dummy_image(
  './lgbpimg/dummy_invert.png',
  'black',
  'white',
  'lifegamebot.bsky.social'
)
