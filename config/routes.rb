Rails.application.routes.draw do
  devise_for :users
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  root to: 'routes#show_all'

  get '/refresh', to: 'routes#refresh'

  get '/posts/page/:page' => 'posts#sort_posts'
  resources :posts do
    member do
      put '/increment_views' => 'posts#increment_views'
      put '/upvote' => 'posts#upvote'
      delete '/upvote' => 'posts#delete_upvote'
      put '/downvote' => 'posts#downvote'
      delete '/downvote' => 'posts#delete_downvote'
      put '/save_post' => 'posts#save_post'
      put '/unsave_post' => 'posts#unsave_post'
    end
  end

  resources :users do
    member do
      get '/saved_posts' => 'users#saved_posts'
    end
  end

  get '/lists/:name/posts', to: 'lists#show_posts'
  get '/lists/:name/posts/page/:page', to: 'lists#sort_posts'

  scope 'l' do
    get ':name' => 'routes#show_list'
  end

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
