#!/usr/bin/env /home/ikatake/local/rbenv/shims/ruby
###!/bin/usr/local/ruby

#モノづくりcgiの読み取り部分を共有化

require_relative './lgb_util.rb'
require 'cgi'
require 'date'
include Math

def cgi_input_wear(cgi, material)
  if (cgi.has_key?('material') == false)
    if(Random.rand(2) >= 1)
      material = "t_shirt"
    else
      material = "hoodie"
    end
  end
  arr = cgi_input(cgi)
  arr.push(material)
end

def cgi_input(cgi)
  print "Content-Type: text/html\n\n"
  print "<html><head><title>Now making...Please wait.</title></head><body>\n"
  text = CGI.escapeHTML cgi["t"]
  print text
  print "<br>"

  #read argument (color)
  if (cgi.has_key?('color')  == false) 
    if(Random.rand(2) >= 1)
      color = "black"
    else
      color = "white"
    end
  else
    if(cgi['color'] == "black")
      color = "black"
    else
      color = "white"
    end
  end
  #read argument (run and step)
  
  #set default parameter
  state = get_lastest_state_text
  arr = get_lastest_run_step
  run = arr[0]
  step = arr[1]
  if (cgi.has_key?('run'))
    #min(run, run_input) 
    run = (run < cgi['run'].to_i) ? run : cgi['run'].to_i
    step = measure_run(run) 
    step = (step < cgi['step'].to_i) ? step : cgi['step'].to_i
  end
  if (cgi.has_key?('step'))
    #min(step, step_input)
    step = (step < cgi['step'].to_i) ? step : cgi['step'].to_i
  end
  state = get_state_text(run, step)
	puts run
	puts '<br>'
	puts step
	puts '<br>'
	puts is_valid_run_step?(run, step) 
	puts '<br>'
	puts state
	puts '<br>'
  arr = [run, step, state, color]

end
