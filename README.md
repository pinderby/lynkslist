The OpenShift `ruby` cartridge documentation can be found at:

http://openshift.github.io/documentation/oo_cartridge_guide.html#ruby


ssh 5731649189f5cf9d8700001c@lynkslist-pinderby.rhcloud.com

tail -f -n 100 app-root/logs/ruby.log

list = List.new
list.name = "news"
list.description = "List for top news stories"
list.permission_level = "community"
list.save

list = List.new
list.name = "tech"
list.description = "List for tech articles"
list.permission_level = "community"
list.save


source = Source.new
source.name = "TechCrunch"
source.source_url = "http://techcrunch.com/"
source.profile_url = "https://pbs.twimg.com/profile_images/615392662233808896/EtxjSSKk.jpg"
source.save

source = Source.new
source.name = "CNN"
source.source_url = "http://www.cnn.com/"
source.profile_url = "https://pbs.twimg.com/profile_images/508960761826131968/LnvhR8ED.png"
source.save

source = Source.new
source.name = "NYTimes"
source.source_url = "http://www.nytimes.com/"
source.profile_url = "https://pbs.twimg.com/profile_images/2044921128/finals_400x400.png"
source.save

source = Source.new
source.name = "BBC"
source.source_url = "http://www.bbc.com/"
source.profile_url = "https://pbs.twimg.com/profile_images/662708106/bbc.png"
source.save

