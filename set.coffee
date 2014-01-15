class Set
  constructor: (arr) ->
    arr ?= []
    @set = {}
    @set[item] = true for item in arr
    @arr = (item for item of @set)

  asArray: ->
    @arr

  toString: () ->
    "{ #{ @asArray().join ', ' } }"  

  intersection: (otherSet) ->
    items = (item for item of @set when item of otherSet.set)
    new Set(items)

  union: (otherSet) ->
    new Set(@asArray().concat otherSet.asArray())

  subtract: (otherSet) ->
    items = (item for item of @set when not (item of otherSet.set))
    new Set(items)

  length: -> @asArray().length

module.exports = Set

