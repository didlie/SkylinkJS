# Implementing a Statistics Service Class

1. Clone auth-stats-service.js file and change its name.
2. Change the name of the constructor function.
3. Implement a custom _buildData(params) method to return the data to be sent to the stats server.
4. Return the right endpoint for the new service _getEndpoint().


## The base class
The base class StatsBaseService implements 2 public interfaces:

1. getEndpoints(): returns all the endpoints available in the stats service.
2. send(): implements a template pattern to send the data generate in the concrete class
_buildData().
