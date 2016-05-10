class ListsController < ApplicationController
	protect_from_forgery with: :exception
	respond_to :html, :xml, :json

	def show_posts
		@list = List.find_by name: params[:name]
		@posts = @list.posts.sort_by(&:published_at).reverse.uniq

		render json: @posts, include: :source
	end
end