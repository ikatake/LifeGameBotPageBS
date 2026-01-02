#!/home/ikatake/local/rbenv/shims/ruby

#ライフゲームbot用の便利関数たち。

def get_state_text(run, step)
  # set filename
  runstr = sprintf("%08d", run)
  stepstr = sprintf("%08d", step)
  filename = "/home/ikatake/www/wetsteam/LifeGameBotBS/stateLogs/"
  filename = filename + genestr  + "\/" + stepstr + ".txt"
  file = File.open(filename)
  text = file.read
  file.close
  
  lines = text.split(/\n/)
  r = "";
  10.times do |i|
    r += (lines[i] + '\n')
  end
  return r
end

def get_lastest_run_step()
  filename = "/home/ikatake/local/bslg/state.txt"
  file = File.open(filename)
  text = file.read
  file.close
  lines = text.split(/\n/)
  arr = lines[10].split(/\t/)
  run = arr[1].to_i
  arr = lines[11].split(/\t/)
  step = arr[1].to_i
  arr = [run, step]
  return arr
end

def get_lastest_state_text()
  filename = "/home/ikatake/local/bslg/state.txt"
  file = File.open(filename)
  text = file.read
  file.close
  lines = text.split(/\n/)
  r = "";
  10.times do |i|
    r += (lines[i] + '\n')
  end
  return r
end

def is_valid_run_step?(run, step)
  arr = get_lastest_run_step()
  cur_run = arr[0]
  cur_step = arr[1]
  if run > cur_run
    return false
  end
  if run == cur_run
    if step > cur_step
      return false
    else
      return true
    end
  end
  if step > measure_run(run)
    return false
  else
    return true
  end
end

def measure_run(run)
  dir_path = '/home/ikatake/www/wetsteam/LifeGameBotBS/stateLogs/'
  dir_path << sprintf("%08d/", run) 
  if ( FileTest.exist?(dir_path) && FileTest.directory?(dir_path) ) == false
    return -1;
  end
  arr = Dir.glob(dir_path + "[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9].txt")
  return arr.size
end
  


