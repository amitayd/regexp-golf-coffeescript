Set = require('./set')
{flatten, max} = require('./utils')


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
  for w of wholes.set
    for p of subparts(w).set
      for d of dotify(p).set
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
    new Set(flatten(c+rest for rest of dotify(part[1..]).set for c in replacements(part[0])))

###Return possible replacement characters for char (char + '.' unless char is special).###
replacements = (char) ->
  if ('^$'.indexOf(char) >= 0)
    char 
  else
    char + '.'    

###Return a set of all the strings that are matched by regex.###
matches = (regex, strings) ->
  set =  new Set(s for s of strings.set when (new RegExp(regex)).test(s))
  set


### Replace a character at a given x with "_"###
rmChar = (s, index) -> 
  s.substr(0, index) + '_' + s.substr(index + 1);


###Find a regex that matches all winners but no losers (sets of strings).###
findregex = (winners, losers) ->
  # Make a pool of regex components, then pick from them to cover winners.

  pool = regexComponents(winners, losers)
  for i in [0..2]
    cover = findRegexInner(winners, losers, pool, [])
    found = cover.join('|');
    verify(found, winners, losers)
    console.log "Found:", found, found.length
  
  return found

### 
The actual recursive implementation of finding the regexp
###
findRegexInner = (winners, losers, pool, cover) ->
  # On each iteration, add the 'best' component to 'cover',
  # remove winners covered by best, and keep in 'pool' only components
  # that still match some winner.
  if (winners.length() == 0) 
    return

  rankFunc = (c) -> 
    3 * matches(c, winners).length() - c.length + Math.random() * 100

  best = max(pool.asArray(), rankFunc)
  cover.push(best)
  winnersUpdated = winners.subtract matches(best, winners)
  poolUpdated = new Set(c for c of pool.set when matches(c, winners).length() > 0)
  findRegexInner(winnersUpdated, losers, poolUpdated, cover)
  return cover

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
  for part of parts.set
    for charIndex in [0..(part.length - 1)]
      char = part[charIndex]
      blanked = rmChar(part, charIndex)
      (blankedParts[blanked] ||= {})[char] = true

  # Create all the the character sets permutations for the created blankedParts
  groupedParts = []
  for blanked, letters of blankedParts
    lettersStr = (letter for letter of letters).join('')
    perms = getPermutations(lettersStr)
    for perm in perms
      # TODO: Yuck, do the escaping it in getPermutations?
      perm = perm.replace('$', '\\$').replace('^', '\\^')
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
