#!/home/ikatake/local/rbenv/shims/ruby

#ライフゲームbot用の便利関数たち。

def get_state_text(run, gene)
  # set filename
  runstr = sprintf("%08d", run)
  genestr = sprintf("%08d", gene)
  filename = "/home/ikatake/www/wetsteam/LifeGameBotBS/stateLogs/"
  filename = filename + runstr  + "\/" + genestr + ".txt"
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

def get_lastest_run_gene()
  filename = "/home/ikatake/local/bslg/state.txt"
  file = File.open(filename)
  text = file.read
  file.close
  lines = text.split(/\n/)
  arr = lines[10].split(/\t/)
  run = arr[1].to_i
  arr = lines[11].split(/\t/)
  gene = arr[1].to_i
  arr = [run, gene]
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

def is_valid_run_gene?(run, gene)
  arr = get_lastest_run_gene()
  cur_run = arr[0]
  cur_gene = arr[1]
  if run > cur_run
    return false
  end
  if run == cur_run
    if gene > cur_gene
      return false
    else
      return true
    end
  end
  if gene > measure_run(run)
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
  


