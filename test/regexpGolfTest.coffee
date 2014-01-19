Set = require '../src/set'
regexpGolf = require('../src/regexpGolf.coffee')

exports.RegExpGolfTest =

    'test can find regexp with default options': (test) ->
        winners = new Set(['one', 'two', 'three'])
        losers = new Set(['four', 'five', 'six'])
        result = regexpGolf.find(winners, losers)
        test.ok(result.length == 1, 'one regexp returned with default options')
        test.equals(result[0].length, 4, 'expression should be short: #{result[0]}');
        regexp = new RegExp(result[0])

        for winner in winners.arr
          test.ok(regexp.test(winner), "#{regexp}: winner #{winner} matched")

        for loser in losers.arr
          test.ok(!regexp.test(loser), "#{regexp}: loser #{loser} not matched")
        

        test.done()

