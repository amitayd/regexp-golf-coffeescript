max = (arr, rankFunc) ->
  rankFunc ?=  (x) -> x

  maxFound = arr.reduce (currMax,element) -> 
    rank = rankFunc(element)
    if currMax.rank > rank then currMax else {rank: rank, element: element}
  maxFound.element

flatten = (a)->
  if a.length is 0
    return []
  else
    return ( a.reduce (l,r)->l.concat(r) )


topMax = (arr, rankFunc, numToReturn) ->
  rankFunc ?=  (x) -> x
  
  if numToReturn == 1 
    [max(arr, rankFunc)]    
  else 
    ranked = arr.map (el) -> {el: el, rank: rankFunc(el)}
    ranked.sort (a, b) ->
      b.rank - a.rank
    return ranked[..numToReturn-1].map (el) -> el.el

module.exports = {
  max: max
  flatten: flatten,
  topMax: topMax
}



