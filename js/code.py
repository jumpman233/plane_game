import os,sys
import codecs

def count_file_code(file_path):
	code_num = 0
	if(os.path.isfile(file_path)):
		f = codecs.open(file_path, 'r', 'utf-8')
		for line in f:
			code_num += 1
		f.close()
	return code_num

def count_dir_code(file_path, file_ext):
	code_num = 0
	for path, d ,filelist in os.walk(file_path):
		for file in filelist:
			if(file.find(file_ext)>=0):
				num = 0
				f_p = os.path.join(path,file)
				code_num += count_file_code(f_p)
	return code_num

class dir:
	path = ''
	ext = ''

file_path = os.path.split(os.path.realpath(__file__))[0]

config_file = ".countinclude"
include_file = []

count_include = codecs.open(config_file, 'r', 'utf-8')

for line in count_include:
	f = dir()
	p = line.replace('/','\\').replace('\n','')
	n = p.find('*')
	if(n>=0):
		f.path = os.path.join(file_path,p[:n])
		f.ext = p[n+1:]
	else:
		f.path = p
		f.ext = ''
	include_file.append(f)

count_include.close()

code_line_all = 0

print("code count directory: \n ")
for item in include_file:
	print(item.path + item.ext)

for item in include_file:
	if(os.path.isdir(item.path)):
		code_line_all += count_dir_code(item.path, item.ext)
	if(os.path.isfile(item.path)):
		code_line_all += count_file_code(item.path)

print("all code " + str(code_line_all) + " lines")
