class ListsController < ApplicationController
	protect_from_forgery with: :exception
	respond_to :html, :xml, :json

	def create
	  respond_with List.create(params[:list])
	end

	def show
	  respond_with List.find(params[:id])
	end

	def show_posts
		@list = List.find_by name: params[:name]
		@posts = @list.posts.sort_by(&:published_at).reverse.uniq

		render json: @posts.to_json(include: [:source, :votes])
	end
end