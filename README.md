# Assumptions
1. Data of pricing inside test_data is correct (considering example in README.md) hence is updated

    List of available products
    * `cheerios`
    * `cornflakes`
    * `frosties`
    * `shreddies`
    * `weetabix`

    ## Example
    The below is a sample with the correct values you can use to confirm your calculations

    ### Inputs
    * Add 1 × cornflakes @ 2.52 each
    * Add another 1 x cornflakes @2.52 each
    * Add 1 × weetabix @ 9.98 each
    
    ### Results  
    * Cart contains 2 x cornflakes
    * Cart contains 1 x weetabix
    * Subtotal = 15.02
    * Tax = 1.88
    * Total = 16.90
2. People will hit the API without authentication (**unsafe**) - Use AWS Cognito Authorizer instead

# Steps to run the sever
1. Start the price API `npm run serve-products`
1. Start the cart server `npm run cart-server`
