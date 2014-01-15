Set = require('./set')
regexpGolf = require('./regexpGolf')

if require.main == module
  winners =  new Set('washington adams jefferson jefferson madison madison monroe monroe adams jackson jackson vanburen harrison polk taylor pierce buchanan
  lincoln lincoln grant grant hayes garfield cleveland harrison cleveland mckinley
   mckinley roosevelt taft wilson wilson harding coolidge hoover roosevelt 
  roosevelt roosevelt roosevelt truman eisenhower eisenhower kennedy johnson nixon 
  nixon carter reagan reagan bush clinton clinton bush bush obama obama'.split /[ ]+/)

  losers = new Set('clinton jefferson adams pinckney pinckney clinton king adams 
  jackson adams clay vanburen vanburen clay cass scott fremont breckinridge 
  mcclellan seymour greeley tilden hancock blaine cleveland harrison bryan bryan 
  parker bryan roosevelt hughes cox davis smith hoover landon wilkie dewey dewey 
  stevenson stevenson nixon goldwater humphrey mcgovern ford carter mondale 
  dukakis bush dole gore kerry mccain romney'.split /[ ]+/)

  losers = losers.subtract winners

  #a.[at]|i..[nodct]|j|oo|bu|n.e|ay.|ru|po|oe|di|nd$ can't remember how this was found

  found = regexpGolf.find(winners, losers)
  #console.log "Found:", found, found.length