class Post < ActiveRecord::Base
	has_and_belongs_to_many :lists
	has_many :saving_users,  -> { uniq }, source: :user, :through => :saves
	has_many :saves, class_name: "Save"
	has_many :voting_users,  -> { uniq }, source: :user, :through => :votes
	has_many :votes
	belongs_to :source
	default_scope -> { order('published_at DESC') }

	def calc_points
		# add up all points
		self.points = 0
		self.votes.each do |v|
			self.points += v.value
		end
		self.save
	end

	def self.eliminate_duplicates
		# find all models and group them on keys which should be common
		grouped = all.group_by{|post| [post.title] }
		grouped.values.each do |duplicates|
			# the first one we want to keep right?
			first_one = duplicates.shift # or pop for last one
			# if there are any more left, they are duplicates
			# so delete all of them
			duplicates.each{|double| double.destroy} # duplicates can now be destroyed
		end
	end

end
