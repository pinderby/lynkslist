class UsersController < ApplicationController
	before_filter :authenticate_user!
	protect_from_forgery with: :exception
	respond_to :html, :xml, :json

	def index
		# @posts = Post.all.sort_by(&:published_at).reverse
		# respond_with @posts, include: :source
	end

	def show
	  respond_with User.find(params[:id]).to_json(include: [:saved_posts, :voted_posts, :votes])
	end

	def saved_posts
	  if current_user
	  	@posts = current_user.saved_posts

	  	respond_with @posts, include: :source
	  else
	  	# TODO --DM-- send to login
	  	render status: :unauthorized
	  end
	end

	private
	def post_params
	  params.require(:post).permit(:link, :title)
	end
end
