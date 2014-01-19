Set = require('./set.coffee')
{flatten, max, topMax} = require('./utils.coffee')

verify = (found, winners, losers) ->
  regexp = new RegExp(found)
  missedWinners = winner for winner of winners.set when not (regexp.test(winner))
  missedLosers = loser for loser of losers.set when regexp.test loser

  if missedWinners
    console.log "Error: #{regexp} should match but did not: #{missedWinners}"
  if missedLosers
    console.log "Error: #{regexp} should not match but did: #{missedLosers}"

  return not (missedWinners or missedWinners)

regexComponents = (winners, losers) ->
  "Return components that match at least one winner, but no loser."
  wholes = new Set('^'+winner+'$' for winner of winners.set)
  parts = []
  for w in wholes.arr
    for p in subparts(w).arr
      for d in dotify(p).arr
        if not matches(d, losers).length()
          parts.push d

  partsSet = new Set(parts)
  groupedParts = getGroupedParts(partsSet)

  return partsSet.union(wholes).union(groupedParts)


### Return a set of subparts of word, consecutive characters up to length 4. ###
subparts = (word) ->
  return new Set(flatten(word[i..i+n-1] for i in [0..word.length-1] for n in [1..4]))

### Return all ways to replace a subset of chars in part with '.'. ###
dotify = (part) ->
  
  if part == ''
    new Set([''])
  else
    new Set(flatten(c+rest for rest in dotify(part[1..]).arr for c in replacements(part[0])))

###Return possible replacement characters for char (char + '.' unless char is special).###
replacements = (char) ->
  if ('^$'.indexOf(char) >= 0)
    char 
  else
    char + '.'    

###Return a set of all the strings that are matched by regex.###
matches = (regex, strings) ->
  new Set(s for s in strings.arr when (new RegExp(regex)).test(s))

### Replace a character at a given x with "_"###
rmChar = (s, index) -> 
  s.substr(0, index) + '_' + s.substr(index + 1);


###Find a regex that matches all winners but no losers (sets of strings).###
findregex = (winners, losers, settings) ->
  settings ?= {}
  settings.branches ?= 1
  settings.depthBranches ?= {}
  settings.randomFactor ?= 1

  if winners.intersection(losers).length() > 0
    throw new Error("Winners should not intersect with losers")

  # Make a pool of regex components, then find best covers
  pool = regexComponents(winners, losers)
  covers = findRegexInner(winners, losers, pool, settings)
  foundRegexps = covers.map (cover) -> cover.join('|');
  foundRegexps.sort (a,b) -> a.length - b.length
  for found in foundRegexps.reverse()
    verify(found, winners, losers)
    console.log "Found:", found, found.length
  
  return foundRegexps

### 
The actual recursive implementation of finding the regexp
Can return multiple covers path, since it supports generating
a cover for multiple "bests".
###
findRegexInner = (winners, losers, pool, settings, depth) ->

  if (winners.length() == 0) 
    return [[]]

  depth ?= 1
  numBests = settings.depthBranches[depth] ? settings.branches
  console.log depth, numBests
  
  covers = []
  
  rankFunc = (c) -> 
    2.9 * matches(c, winners).length() - c.length + Math.random() * settings.randomFactor

  bests = topMax(pool.asArray(), rankFunc, numBests)

  for best in bests
    # On each iteration, add a 'best' component to 'cover',
    # remove winners covered by best, and keep in 'pool' only components
    # that still match some winner, then compute the covers for the remaining 
    # winners and pool, and concat the to the current part
    winnersUpdated = winners.subtract matches(best, winners)
    poolUpdated = new Set(c for c in pool.arr when matches(c, winnersUpdated).length() > 0)
    innerCovers = findRegexInner(winnersUpdated, losers, poolUpdated, settings, depth+1)
    for innerCover in innerCovers
      covers.push [best].concat innerCover

  return covers

###
gets possible combined parts using character sets for a given input
For example, given {'Amitay', 'Bmitay', 'Cmitay' 'Dobo'} it should return
{'[AB]mitay', '[AC]mitay', '[BC]mitay'}
###
getGroupedParts = (parts) ->

  # Create a dictionary of a single character blanked forms of the parts, with all the characters
  # that appear were blanked as its value, i.e.
  # {_mitay: {'A': true, 'B': true}}
  blankedParts = {}
  for part in parts.arr
    for charIndex in [0..(part.length - 1)]
      char = part[charIndex]
      if char != "$" and char != "^"
        blanked = rmChar(part, charIndex)
        (blankedParts[blanked] ||= {})[char] = true

  # Create all the the character sets permutations for the created blankedParts
  groupedParts = []
  for blanked, letters of blankedParts
    lettersStr = (letter for letter of letters).join('')
    perms = getPermutations(lettersStr)
    for perm in perms
      # TODO: Yuck, do the escaping it in getPermutations?
      #perm = perm.replace('$', '\\$').replace('^', '\\^')
      if perm.length > 1
        groupedPart = blanked.replace("_", "[#{perm}]")
        groupedParts.push(groupedPart)

  return new Set(groupedParts)
      


###
Get all string permutations, keeping the characters order. 
I.e., for "abc" return ['', 'a', 'ab', 'ac', 'abc', ...] 
###
getPermutations = (str) ->
  if str.length == 1
    [str, '']
  else
    head = str[0]
    tail = str[1..]
    perms = getPermutations(tail)
    tmp = []
    for perm in perms
      tmp.push head + perm
      tmp.push perm
    return tmp

module.exports = {
  find: findregex
}