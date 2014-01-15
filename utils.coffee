max = (arr, rankFunc) ->
  rankFunc ?=  (x) -> x

  maxFound = arr.reduce (currMax,element) -> 
    rank = rankFunc(element)
    if currMax.rank > rank then currMax else {rank: rank, element: element}
  maxFound.element

flatten = (a)->
   a.reduce (l,r)->l.concat(r)

module.exports = {
  max: max
  flatten: flatten,
}
