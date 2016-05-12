class Post < ActiveRecord::Base
	has_and_belongs_to_many :lists
	has_many :users, :through => :saves
	belongs_to :source

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
