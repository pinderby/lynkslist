class RoutesController < ApplicationController
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  require 'feedlr'

  def show_all
  	@params = Hash.new
  	@params[:name] = "all"
    render 'layouts/application'
  end

  def show_list
  	@params = Hash.new
  	@params[:name] = params[:name]
  	@params[:model] = "list"
    render 'layouts/application'
  end

  def show_saved_posts
  	@params = Hash.new
  	@params[:name] = "saved_posts"
  	@params[:model] = "user"
    render 'layouts/application'
  end

  def refresh
	client = Feedlr::Client.new
	sanitizer = Rails::Html::FullSanitizer.new
	feed_json = client.stream_entries_contents("feed/http://feeds.feedburner.com/Techcrunch")
	list = List.find_by name: "tech"
	feed_json.items.each do |item|
		post = (Post.find_by title: item.title) ? (Post.find_by title: item.title) : Post.new
		post.title = item.title
		post.canonical_url = item.canonicalUrl
		post.summary = item.key?("summary") ? sanitizer.sanitize(item.summary.content) : ""
		post.content_type = "article"
		post.published_at = Time.at(item.published/1000).to_datetime
		post.img_url = (item.key?("thumbnail") && item.thumbnail[1]) ? item.thumbnail[1].url.split('?')[0]+"?w=200&h=200&crop=1" : ""
		post.source = Source.find_by name: "TechCrunch"
		list.posts << post
		post.save
	end

	feed_json = client.stream_entries_contents("feed/http://rss.cnn.com/rss/cnn_topstories.rss")
	list = List.find_by name: "news"
	feed_json.items.each do |item|
		post = (Post.find_by title: item.title) ? (Post.find_by title: item.title) : Post.new
		post.title = item.title
		post.canonical_url = item.canonicalUrl
		post.summary = item.key?("summary") ? sanitizer.sanitize(item.summary.content) : ""
		post.content_type = "article"
		post.published_at = Time.at(item.published/1000).to_datetime
		post.img_url = item.key?("thumbnail") ? item.thumbnail[0].url : ""
		post.source = Source.find_by name: "CNN"
		list.posts << post
		post.save
	end

	feed_json = client.stream_entries_contents("feed/http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml")
	list = List.find_by name: "news"
	feed_json.items.each do |item|
		post = (Post.find_by title: item.title) ? (Post.find_by title: item.title) : Post.new
		post.title = item.title
		post.canonical_url = item.canonicalUrl
		post.summary = item.key?("summary") ? sanitizer.sanitize(item.summary.content) : ""
		post.content_type = "article"
		post.published_at = Time.at(item.published/1000).to_datetime
		post.img_url = item.key?("thumbnail") ? item.thumbnail[0].url : ""
		post.source = Source.find_by name: "NYTimes"
		list.posts << post
		post.save
	end

	feed_json = client.stream_entries_contents("feed/http://newsrss.bbc.co.uk/rss/newsonline_world_edition/front_page/rss.xml")
	list = List.find_by name: "news"
	feed_json.items.each do |item|
		post = (Post.find_by title: item.title) ? (Post.find_by title: item.title) : Post.new
		post.title = item.title
		post.canonical_url = item.canonicalUrl
		post.summary = item.key?("summary") ? sanitizer.sanitize(item.summary.content) : ""
		post.content_type = "article"
		post.published_at = Time.at(item.published/1000).to_datetime
		post.img_url = item.key?("thumbnail") ? item.thumbnail[0].url : ""
		post.source = Source.find_by name: "BBC"
		list.posts << post
		post.save
	end

	posts = Post.all.sort_by(&:published_at).reverse

	render json: posts, include: :source
  end


end