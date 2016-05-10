class SourcesController < ApplicationController
	protect_from_forgery with: :exception
	respond_to :html, :xml, :json

	def index
	end
end