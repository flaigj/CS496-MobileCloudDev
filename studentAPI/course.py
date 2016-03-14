# Author: Jason Flaig
# Sources: Lecture code

from google.appengine.ext import ndb
import webapp2
import db_models
import json
import string
import datetime
import time
from time import mktime

class Course(webapp2.RequestHandler):
	def post(self):
		"""Creates a Course entity

		POST Body Variables
		name - Required. Coursename
		days - Required. Only letters allowed: MTWRF
		time - Required. 
		"""
		# verify application/json request
		#if 'application/json' not in self.request.accept:
		#	self.response.status = 406
		#	self.response.status_message = "Not Acceptable, API supports application/json MIME type"
		#	return
		
		# create new course with vars
		new_course = db_models.Course()
		name = self.request.get('name', default_value=None)
		days = self.request.get('days', default_value=None)
		time = self.request.get('time', default_value=None)

		# if required fields not entered append to errors
		if name:
			new_course.name = name
		else:
			self.response.status = 400
			self.response.status_message = "Invalid request, Name required"
		if days:	
			new_course.days = days
		else:
			self.response.status = 400
			self.response.status_message = "Invalid request, Days required"	
		if time:		
			new_course.time = time
		else:
			self.response.status = 400
			self.response.status_message = "Invalid request, Time required"

		# add record to datastore
		key = new_course.put()
		out = new_course.to_dict()
		self.response.write(out)
		return

	def get(self, **kwargs):
		# if not application/json end
		#if 'application/json' not in self.request.accept:
		#	self.response.status_message = "Not Acceptable, API only supports application/json MIME type"
		#	return
		
		# write a specific id's attributes
		if 'cid' in kwargs:
			out = ndb.Key(db_models.Course, int(kwargs['cid'])).get().to_dict()
			self.response.write(json.dumps(out))

		# write all ids
		else:
			q = db_models.Course.query()
			# keys = q.fetch(keys_only=True)
			# results = { 'keys' : [x.id() for x in keys]}
			# results = [{'key':x.key.id(), 'name':x.name, 'days':x.days, 'time':x.time} for x in q.fetch()]
			results = [{'key':x.key.id(), 'name':x.name, 'days':x.days, 'time':x.time} for x in q.fetch()]
			self.response.write(json.dumps(results))

class UpdateCourse(webapp2.RequestHandler):
	def post(self):
		# verify application/json request
		if 'application/json' not in self.request.accept:
			self.response.status = 406
			self.response.status_message = "Not Acceptable, API only supports application/json"
			return
		# get id 
		courseID = int(self.request.get('key'))
		course = db_models.Course().get_by_id(int(courseID))

		name = self.request.get('name', default_value=None)
		days = self.request.get('days', default_value=None)
		time = self.request.get('time', default_value=None)
				
		# if fields entered change else no fields modified
		if name:
			course.name = name
		if days:
			course.days = days
		if time:
			course.time = time
					
		key = course.put()
		out = course.to_dict()
		self.response.write(json.dumps(out))
		return

class DeleteCourse(webapp2.RequestHandler):
	def post(self):
		# verify application/json request
		# if 'application/json' not in self.request.accept:
		# 	self.response.status = 406
		# 	self.response.status_message = "Not Acceptable, API only supports application/json"
		# 	return
		# get id 
		courseID = int(self.request.get('key'))
		course = db_models.Course().get_by_id(int(courseID))
		course.key.delete()