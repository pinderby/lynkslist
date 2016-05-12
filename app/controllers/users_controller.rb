class UsersController < ApplicationController
	before_filter :authenticate_user!
	protect_from_forgery with: :exception
	respond_to :html, :xml, :json

	def index
		# @posts = Post.all.sort_by(&:published_at).reverse
		# respond_with @posts, include: :source
	end

	def show
	  respond_with User.find(params[:id]), include: :saved_posts
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

	def increment_views
	  @post = Post.find(params[:id])
	  @post.increment!(:views)

	  respond_with @post
	end

	def save_post
	  @post = Post.find(params[:id])
	  if current_user
	  	current_user.saved_posts << @post
	  else
	  	# TODO --DM-- send to login
	  	render status: :unauthorized
	  end
	end

	def unsave_post
	  @post = Post.find(params[:id])
	  if current_user
	  	current_user.saved_posts.delete(@post)
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
