# Author: Jason Flaig
# Sources: Lecture code

import webapp2
from google.appengine.ext import ndb
import db_models
import json

class Register(webapp2.RequestHandler):
	def post(self):
		"""Creates a Register entity

		POST Body Variables:
		username - Register username
		password - Register password
		"""
		new_user = db_models.Register()
		username = self.request.get('username', default_value=None)
		password = self.request.get('password', default_value=None)		

		# if username given
		if username:
			# checks entered username against all usernames in db
			user_exists = [u.username for u in db_models.Register.query(db_models.Register.username == username).fetch()]

			# if username already in db
			# error username must be unique
			if username in user_exists:
				if not password:
					self.response.status = 400
					self.response.status_message = "Username not unique and no password given"
				else:
					self.response.status = 400
					self.response.status_message = "Username not unique"
			# user is unique
			# add user
			else:
				if not password:
					self.response.status = 400
					self.response.status_message = "No password given"
				else:
					new_user.username = username
					new_user.password = password

					key = new_user.put()
					out = new_user.to_dict()
					self.response.write(json.dumps(out))
		else:
			self.response.status = 400
			self.response.status_message = "Invalid request"
		return

class Login(webapp2.RequestHandler):
	def post(self):
		"""Returns a status code of 200 if login success

		POST Body Variables:
		username - Register username
		password - Register password
		"""
		new_user = db_models.Register()
		username = self.request.get('username', default_value=None)
		password = self.request.get('password', default_value=None)		
		user_exists = []
		# if username given
		if username:
			# checks entered username against all usernames in db
			user_exists = [u.username for u in db_models.Register.query(db_models.Register.username == username).fetch()]


			# if username and password matches return username
			if username in user_exists:
				if not password:
					self.response.status = 400
					self.response.status_message = "Username not unique and no password given"
				else:
					#self.response.status = 200
					#self.response.status_message = "OK"
					# new_user.username = username
					# new_user.password = password
					user_match = db_models.Register.query(db_models.Register.username == username).fetch()
					if password == user_match[0].password:
						# out = new_user.to_dict()
						self.response.write(json.dumps({'username': user_match[0].username}))
					# password doesn't match
					else:
						self.response.status = 410
						self.response.status_message = "Username doesn't exist"
			# user doesn't match 
			else:
				self.response.status = 400				
		else:
			self.response.status = 400
			self.response.status_message = "Username doesn't exist"			
		return

class Student(webapp2.RequestHandler):
	def post(self):
		"""Creates a Student entity

		POST Body Variables:
		username - Student username
		name - Student name
		major - Major
		courses[] - Array of Course ids
		"""
		#if 'application/json' not in self.request.accept:
		#	self.response.status = 406
		#	self.response.status_message = "Not Acceptable, API supports application/json"
		#	return
		new_student = db_models.Student()
		username = self.request.get('username', default_value=None)		
		name = self.request.get('name', default_value=None)
		major = self.request.get('major', default_value=None)
		courses = self.request.get_all('courses[]', default_value=None)
		if username:
			new_student.username = username
		if name:
			new_student.name = name
		# else:
		# 	self.response.status = 400
		# 	self.response.status_message = "Invalid request"
		if major:
			new_student.major = major
		# else:
		# 	self.response.status = 400
		# 	self.response.status_message = "Invalid request"
		if courses:
			for course in courses:
				new_student.courses.append(ndb.Key(db_models.Course, int(course)))
		
		key = new_student.put()
		out = new_student.to_dict()
		self.response.write(json.dumps(out))
		return
	
	def get(self, **kwargs):
		# if not application/json end
		#if 'application/json' not in self.request.accept:
		#	self.response.status_message = "Not Acceptable, API only supports application/json MIME type"
		#	return
		
		# write a specific id's attributes
		if 'sid' in kwargs:
			out = ndb.Key(db_models.Student, int(kwargs['sid'])).get().to_dict()
			self.response.write(json.dumps(out))

		# write all ids
		else:
			q = db_models.Student.query()
			# keys = q.fetch(keys_only=True)
			# results = { 'keys' : [x.id() for x in keys]}
			#results = [{'key':x.key.id(), 'username': x.username, 'name':x.name, 'major':x.major, 'courses':[x.courses]} for x in q.fetch()]
			#results = [{'courses':[x.courses]} for x in q.fetch()]
			results = [{'key':x.key.id(), 'username': x.username, 'name':x.name, 'major':x.major} for x in q.fetch()]
			self.response.write(json.dumps(results))

class UpdateStudent(webapp2.RequestHandler):
	def post(self):
		# verify application/json request
		# if 'application/json' not in self.request.accept:
		# 	self.response.status = 406
		# 	self.response.status_message = "Not Acceptable, API only supports application/json"
		# 	return
		# get id 
		studentID = int(self.request.get('key'))
		student = db_models.Student().get_by_id(int(studentID))

		name = self.request.get('name', default_value=None)
		major = self.request.get('major', default_value=None)
		courses = self.request.get('courses[]', default_value=None)
				
		# if fields entered change else no fields modified
		if name:
			student.name = name
		if major:
			student.major = major
		if courses:
			for c in courses:
				student.courses.append(ndb.Key(db_models.Course, int(courses)))
					
		key = student.put()
		out = student.to_dict()
		self.response.write(json.dumps(out))
		return

class DeleteStudent(webapp2.RequestHandler):
	def post(self):
		# # verify application/json request
		# if 'application/json' not in self.request.accept:
		# 	self.response.status = 406
		# 	self.response.status_message = "Not Acceptable, API only supports application/json"
		# 	return
		# get id 
		studentID = int(self.request.get('key'))
		student = db_models.Student().get_by_id(int(studentID))
		student.key.delete()

class StudentCourses(webapp2.RequestHandler):
	def put(self, **kwargs):
		# if 'application/json' not in self.request.accept:
		# 	self.response.status = 406
		# 	self.response.status_message = "Not Acceptable, API only supports application/json"
		if 'sid' in kwargs:
			student = ndb.Key(db_models.Student, int(kwargs['sid'])).get()
			if not student:
				self.response.status = 404
				self.response.status_message = "Student Not Found"
				return
		if 'cid' in kwargs:
			course = ndb.Key(db_models.Course, int(kwargs['cid']))
			if not student:
				self.response.status = 404
				self.response.status_message = "Course Not Found"
				return
		if course not in student.courses:
			student.courses.append(course)
			student.put()
		self.response.write(json.dumps(student.to_dict()))
		return

# class StudentCourseDelete(webapp2.RequestHandler):
# 	def delete(self, **kwargs):
# 		if 'sid' in kwargs:
# 			student = ndb.Key(db_models.Student, int(kwargs['sid'])).get()
# 			if not student:
# 				self.response.status = 404
# 				self.response.status_message = "Student Not Found"
# 				return
# 		if 'cid' in kwargs:
# 			course = ndb.Key(db_models.Course, int(kwargs['cid']))
# 			if not student:
# 				self.response.status = 404
# 				self.response.status_message = "Course Not Found"
# 				return
		#for c in student.courses:
			#student.courses.append(course)
			#student.put()
			#student.courses.remove(c)
		#self.response.write(student.courses[0])
		#s = student.query()
		#self.response(s)
		#for c in student.courses:
		#self.response.write(json.dumps(student_courses))
		#return		