class PostsController < ApplicationController
	before_filter :authenticate_user!, only: [:create, :upvote]
	protect_from_forgery with: :exception
	respond_to :html, :xml, :json

	def index
		@posts = Post.all.sort_by(&:published_at).reverse
		respond_with @posts.to_json(include: [:source, :votes])
	end

	def create
	  respond_with Post.create(post_params)
	end

	def show
	  respond_with Post.find(params[:id])
	end

	def increment_views
	  @post = Post.find(params[:id])
	  @post.increment!(:views)

	  respond_with @post
	end

	def upvote
	  @post = Post.find(params[:id])
	  if current_user
	  	current_user.voted_posts.delete(@post)
	  	current_user.votes.create(post_id: @post.id, value: 1)
	  	current_user.voted_posts.uniq!

	  	render json: current_user.voted_posts, status: :ok
	  else
	  	# TODO --DM-- send to login
	  	render nothing: true, status: :unauthorized
	  end
	end

	def delete_upvote
	  @post = Post.find(params[:id])
	  if current_user
	  	current_user.voted_posts.delete(@post)

	  	render json: current_user.voted_posts, status: :ok
	  else
	  	# TODO --DM-- send to login
	  	render nothing: true, status: :unauthorized
	  end
	end

	def downvote
	  @post = Post.find(params[:id])
	  if current_user
	  	current_user.voted_posts.delete(@post)
	  	current_user.votes.create(post_id: @post.id, value: -1)
	  	current_user.voted_posts.uniq!

	  	render json: current_user.voted_posts, status: :ok
	  else
	  	# TODO --DM-- send to login
	  	render nothing: true, status: :unauthorized
	  end
	end

	def delete_downvote
	  @post = Post.find(params[:id])
	  if current_user
	  	current_user.voted_posts.delete(@post)

	  	render json: current_user.voted_posts, status: :ok
	  else
	  	# TODO --DM-- send to login
	  	render nothing: true, status: :unauthorized
	  end
	end

	def save_post
	  @post = Post.find(params[:id])
	  if current_user
	  	current_user.saved_posts << @post
	  	current_user.saved_posts.uniq!

	  	render json: current_user.saved_posts, status: :ok
	  else
	  	# TODO --DM-- send to login
	  	render nothing: true, status: :unauthorized
	  end
	end

	def unsave_post
	  @post = Post.find(params[:id])
	  if current_user
	  	current_user.saved_posts.delete(@post)

	  	render json: current_user.saved_posts, status: :ok
	  else
	  	# TODO --DM-- send to login
	  	render nothing: true, status: :unauthorized
	  end
	end

	private
	def post_params
	  params.require(:post).permit(:link, :title)
	end
end
