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
		# TODO --DM-- implement pagination
		@list = List.find_by name: params[:name]
		@posts = @list.posts.sort_by(&:published_at).reverse.uniq

		render json: @posts.to_json(include: [:source, :votes])
	end

	def sort_posts
		@list = List.find_by name: params[:name]
		timescope = params[:timescope].to_i
		case params[:sort]
		when "recent"
			@posts = @list.posts.reorder(published_at: :desc).page(params[:page]).uniq!
			render json: @posts.to_json(include: [:source, :votes])
		when "upvoted"
			@posts = @list.posts.where(published_at: (Time.now - timescope.day)..Time.now).reorder(points: :desc).page(params[:page]).uniq!
			render json: @posts.to_json(include: [:source, :votes])
		when "viewed"
			@posts = @list.posts.where(published_at: (Time.now - timescope.day)..Time.now).reorder(views: :desc).page(params[:page]).uniq!
			render json: @posts.to_json(include: [:source, :votes])
		else
			render :bad_request
		end
	end
end