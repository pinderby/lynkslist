class PostsController < ApplicationController
	before_filter :authenticate_user!, only: [:create, :upvote]
	protect_from_forgery with: :exception
	respond_to :html, :xml, :json

	def index
		@posts = Post.all.sort_by(&:published_at).reverse
		respond_with @posts.to_json(include: [:source, :votes])
	end

	def show_page
		puts params[:sort]
		@posts = Post.page(params[:page])
		render json: @posts.to_json(include: [:source, :votes])
	end

	def sort_posts
		timescope = params[:timescope].to_i
		case params[:sort]
		when "recent"
			@posts = Post.page(params[:page])
			render json: @posts.to_json(include: [:source, :votes])
		when "upvoted"
			@posts = Post.where(published_at: (Time.now - timescope.day)..Time.now).reorder(points: :desc).page(params[:page])
			render json: @posts.to_json(include: [:source, :votes])
		when "viewed"
			@posts = Post.where(published_at: (Time.now - timescope.day)..Time.now).reorder(views: :desc).page(params[:page])
			render json: @posts.to_json(include: [:source, :votes])
		else
			render :bad_request
		end
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
	  	# Recalculate points
	  	@post.calc_points()

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
	  	# Recalculate points
	  	@post.calc_points()

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
	  	# Recalculate points
	  	@post.calc_points()

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
	  	# Recalculate points
	  	@post.calc_points()

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
