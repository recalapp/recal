# run continuity check

# email setup:
# to set up, must go to https://www.google.com/settings/security/lesssecureapps
# and then to https://accounts.google.com/DisplayUnlockCaptcha if doesn't work on new server (ssh tunnel in)

base_url = "http://recal.io"
continuity_check_url = "/checks/continuity"


import urllib
import time
from datetime import datetime
import socket
import smtplib
import email
import os
from email.MIMEMultipart import MIMEMultipart
from email.Utils import COMMASPACE
from email.MIMEBase import MIMEBase
from email.parser import Parser
from email.MIMEImage import MIMEImage
from email.MIMEText import MIMEText
from email.MIMEAudio import MIMEAudio
import mimetypes

def sendEmail(base_url, tested_url, test_time_utc):
	# sends an email to maxim with this info on failure
	import smtplib
	fromaddr = 'maximz.mailer@gmail.com'
	toaddrs  = 'maxim@maximz.com, dxue@princeton.edu, naphats@princeton.edu' # comma separated
	subject = "RECAL NOTIFICATION: data loss"
	msg = email.MIMEMultipart.MIMEMultipart()
	msg['From'] = fromaddr
	msg['To'] = toaddrs
	msg['Subject'] = subject  
	msg.attach(MIMEText("URL tested: " + base_url + tested_url + ". Time (UTC): " + test_time_utc))
	msg.attach(MIMEText('\nsent via python from ' + socket.gethostname(), 'plain'))
	username = 'maximz.mailer@gmail.com'
	password = 'MailMarvin'
	server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
	server.ehlo()
	#server.starttls()
	server.login(username,password)
	server.sendmail(username ,toaddrs,msg.as_string())
	server.quit()

print 'testing', base_url, continuity_check_url
url = base_url + continuity_check_url
up = urllib.urlopen(url).read() == "OK"
if not up:
	# try again in 5 seconds
	up = urllib.urlopen(url).read() == "OK"
	if not up: # if still not up
		# message us
		sendEmail(base_url, continuity_check_url, str(datetime.utcnow()))
		print 'email sent because failed'
