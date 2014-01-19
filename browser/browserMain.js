;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var Set, findButton, findRegexp, regexpGolf;

  Set = require('../src/set.coffee');

  regexpGolf = require('../src/regexpGolf.coffee');

  findRegexp = function() {
    var found, losers, losersStr, settings, winners, winnersStr;
    winnersStr = document.getElementById('winners').value;
    winners = new Set(winnersStr.split(/[ ]+/));
    losersStr = document.getElementById('losers').value;
    losers = new Set(losersStr.split(/[ ]+/));
    losers = losers.subtract(winners);
    settings = {
      randomFactor: 1,
      branches: 1,
      depthBranches: {}
    };
    console.log('winners:', winners.toString());
    console.log('losers:', losers.toString());
    found = regexpGolf.find(winners, losers, settings);
    return document.getElementById('result').value = found.join('\n');
  };

  findButton = document.getElementById('find');

  findButton.addEventListener("click", findRegexp, false);

}).call(this);


},{"../src/set.coffee":2,"../src/regexpGolf.coffee":3}],2:[function(require,module,exports){
(function() {
  var Set;

  Set = (function() {
    function Set(arr) {
      var item, _i, _len;
      if (arr == null) {
        arr = [];
      }
      this.set = {};
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        item = arr[_i];
        this.set[item] = true;
      }
      this.arr = (function() {
        var _results;
        _results = [];
        for (item in this.set) {
          _results.push(item);
        }
        return _results;
      }).call(this);
    }

    Set.prototype.asArray = function() {
      return this.arr;
    };

    Set.prototype.toString = function() {
      return "{ " + (this.asArray().join(', ')) + " }";
    };

    Set.prototype.intersection = function(otherSet) {
      var item, items;
      items = (function() {
        var _results;
        _results = [];
        for (item in this.set) {
          if (item in otherSet.set) {
            _results.push(item);
          }
        }
        return _results;
      }).call(this);
      return new Set(items);
    };

    Set.prototype.union = function(otherSet) {
      return new Set(this.asArray().concat(otherSet.asArray()));
    };

    Set.prototype.subtract = function(otherSet) {
      var item, items;
      items = (function() {
        var _results;
        _results = [];
        for (item in this.set) {
          if (!(item in otherSet.set)) {
            _results.push(item);
          }
        }
        return _results;
      }).call(this);
      return new Set(items);
    };

    Set.prototype.length = function() {
      return this.asArray().length;
    };

    return Set;

  })();

  module.exports = Set;

}).call(this);


},{}],3:[function(require,module,exports){
(function() {
  var Set, dotify, findRegexInner, findregex, flatten, getGroupedParts, getPermutations, matches, max, regexComponents, replacements, rmChar, subparts, topMax, verify, _ref;

  Set = require('./set.coffee');

  _ref = require('./utils.coffee'), flatten = _ref.flatten, max = _ref.max, topMax = _ref.topMax;

  verify = function(found, winners, losers) {
    var loser, missedLosers, missedWinners, regexp, winner;
    regexp = new RegExp(found);
    for (winner in winners.set) {
      if (!(regexp.test(winner))) {
        missedWinners = winner;
      }
    }
    for (loser in losers.set) {
      if (regexp.test(loser)) {
        missedLosers = loser;
      }
    }
    if (missedWinners) {
      console.log("Error: " + regexp + " should match but did not: " + missedWinners);
    }
    if (missedLosers) {
      console.log("Error: " + regexp + " should not match but did: " + missedLosers);
    }
    return !(missedWinners || missedWinners);
  };

  regexComponents = function(winners, losers) {
    "Return components that match at least one winner, but no loser.";
    var d, groupedParts, p, parts, partsSet, w, wholes, winner, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
    wholes = new Set((function() {
      var _results;
      _results = [];
      for (winner in winners.set) {
        _results.push('^' + winner + '$');
      }
      return _results;
    })());
    parts = [];
    _ref1 = wholes.arr;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      w = _ref1[_i];
      _ref2 = subparts(w).arr;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        p = _ref2[_j];
        _ref3 = dotify(p).arr;
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          d = _ref3[_k];
          if (!matches(d, losers).length()) {
            parts.push(d);
          }
        }
      }
    }
    partsSet = new Set(parts);
    groupedParts = getGroupedParts(partsSet);
    return partsSet.union(wholes).union(groupedParts);
  };

  /* Return a set of subparts of word, consecutive characters up to length 4.*/


  subparts = function(word) {
    var i, n;
    return new Set(flatten((function() {
      var _i, _results;
      _results = [];
      for (n = _i = 1; _i <= 4; n = ++_i) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (i = _j = 0, _ref1 = word.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            _results1.push(word.slice(i, +(i + n - 1) + 1 || 9e9));
          }
          return _results1;
        })());
      }
      return _results;
    })()));
  };

  /* Return all ways to replace a subset of chars in part with '.'.*/


  dotify = function(part) {
    var c, rest;
    if (part === '') {
      return new Set(['']);
    } else {
      return new Set(flatten((function() {
        var _i, _len, _ref1, _results;
        _ref1 = replacements(part[0]);
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          _results.push((function() {
            var _j, _len1, _ref2, _results1;
            _ref2 = dotify(part.slice(1)).arr;
            _results1 = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              rest = _ref2[_j];
              _results1.push(c + rest);
            }
            return _results1;
          })());
        }
        return _results;
      })()));
    }
  };

  /*Return possible replacement characters for char (char + '.' unless char is special).*/


  replacements = function(char) {
    if ('^$'.indexOf(char) >= 0) {
      return char;
    } else {
      return char + '.';
    }
  };

  /*Return a set of all the strings that are matched by regex.*/


  matches = function(regex, strings) {
    var s;
    return new Set((function() {
      var _i, _len, _ref1, _results;
      _ref1 = strings.arr;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        s = _ref1[_i];
        if ((new RegExp(regex)).test(s)) {
          _results.push(s);
        }
      }
      return _results;
    })());
  };

  /* Replace a character at a given x with "_"*/


  rmChar = function(s, index) {
    return s.substr(0, index) + '_' + s.substr(index + 1);
  };

  /*Find a regex that matches all winners but no losers (sets of strings).*/


  findregex = function(winners, losers, settings) {
    var covers, found, foundRegexps, pool, _i, _len, _ref1;
    if (settings.branches == null) {
      settings.branches = 1;
    }
    if (settings.depthBranches == null) {
      settings.depthBranches = {};
    }
    if (settings.randomFactor == null) {
      settings.randomFactor = 1;
    }
    pool = regexComponents(winners, losers);
    covers = findRegexInner(winners, losers, pool, settings);
    foundRegexps = covers.map(function(cover) {
      return cover.join('|');
    });
    foundRegexps.sort(function(a, b) {
      return a.length - b.length;
    });
    _ref1 = foundRegexps.reverse();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      found = _ref1[_i];
      verify(found, winners, losers);
      console.log("Found:", found, found.length);
    }
    return foundRegexps;
  };

  /* 
  The actual recursive implementation of finding the regexp
  Can return multiple covers path, since it supports generating
  a cover for multiple "bests".
  */


  findRegexInner = function(winners, losers, pool, settings, depth) {
    var best, bests, c, covers, innerCover, innerCovers, numBests, poolUpdated, rankFunc, winnersUpdated, _i, _j, _len, _len1, _ref1;
    if (winners.length() === 0) {
      return [[]];
    }
    if (depth == null) {
      depth = 1;
    }
    numBests = (_ref1 = settings.depthBranches[depth]) != null ? _ref1 : settings.branches;
    console.log(depth, numBests);
    covers = [];
    rankFunc = function(c) {
      return 2.9 * matches(c, winners).length() - c.length + Math.random() * settings.randomFactor;
    };
    bests = topMax(pool.asArray(), rankFunc, numBests);
    for (_i = 0, _len = bests.length; _i < _len; _i++) {
      best = bests[_i];
      winnersUpdated = winners.subtract(matches(best, winners));
      poolUpdated = new Set((function() {
        var _j, _len1, _ref2, _results;
        _ref2 = pool.arr;
        _results = [];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          c = _ref2[_j];
          if (matches(c, winnersUpdated).length() > 0) {
            _results.push(c);
          }
        }
        return _results;
      })());
      innerCovers = findRegexInner(winnersUpdated, losers, poolUpdated, settings, depth + 1);
      for (_j = 0, _len1 = innerCovers.length; _j < _len1; _j++) {
        innerCover = innerCovers[_j];
        covers.push([best].concat(innerCover));
      }
    }
    return covers;
  };

  /*
  gets possible combined parts using character sets for a given input
  For example, given {'Amitay', 'Bmitay', 'Cmitay' 'Dobo'} it should return
  {'[AB]mitay', '[AC]mitay', '[BC]mitay'}
  */


  getGroupedParts = function(parts) {
    var blanked, blankedParts, char, charIndex, groupedPart, groupedParts, letter, letters, lettersStr, part, perm, perms, _i, _j, _k, _len, _len1, _ref1, _ref2;
    blankedParts = {};
    _ref1 = parts.arr;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      part = _ref1[_i];
      for (charIndex = _j = 0, _ref2 = part.length - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; charIndex = 0 <= _ref2 ? ++_j : --_j) {
        char = part[charIndex];
        if (char !== "$" && char !== "^") {
          blanked = rmChar(part, charIndex);
          (blankedParts[blanked] || (blankedParts[blanked] = {}))[char] = true;
        }
      }
    }
    groupedParts = [];
    for (blanked in blankedParts) {
      letters = blankedParts[blanked];
      lettersStr = ((function() {
        var _results;
        _results = [];
        for (letter in letters) {
          _results.push(letter);
        }
        return _results;
      })()).join('');
      perms = getPermutations(lettersStr);
      for (_k = 0, _len1 = perms.length; _k < _len1; _k++) {
        perm = perms[_k];
        if (perm.length > 1) {
          groupedPart = blanked.replace("_", "[" + perm + "]");
          groupedParts.push(groupedPart);
        }
      }
    }
    return new Set(groupedParts);
  };

  /*
  Get all string permutations, keeping the characters order. 
  I.e., for "abc" return ['', 'a', 'ab', 'ac', 'abc', ...]
  */


  getPermutations = function(str) {
    var head, perm, perms, tail, tmp, _i, _len;
    if (str.length === 1) {
      return [str, ''];
    } else {
      head = str[0];
      tail = str.slice(1);
      perms = getPermutations(tail);
      tmp = [];
      for (_i = 0, _len = perms.length; _i < _len; _i++) {
        perm = perms[_i];
        tmp.push(head + perm);
        tmp.push(perm);
      }
      return tmp;
    }
  };

  module.exports = {
    find: findregex
  };

}).call(this);


},{"./set.coffee":2,"./utils.coffee":4}],4:[function(require,module,exports){
(function() {
  var flatten, max, topMax;

  max = function(arr, rankFunc) {
    var maxFound;
    if (rankFunc == null) {
      rankFunc = function(x) {
        return x;
      };
    }
    maxFound = arr.reduce(function(currMax, element) {
      var rank;
      rank = rankFunc(element);
      if (currMax.rank > rank) {
        return currMax;
      } else {
        return {
          rank: rank,
          element: element
        };
      }
    });
    return maxFound.element;
  };

  flatten = function(a) {
    if (a.length === 0) {
      return [];
    } else {
      return a.reduce(function(l, r) {
        return l.concat(r);
      });
    }
  };

  topMax = function(arr, rankFunc, numToReturn) {
    var ranked;
    if (rankFunc == null) {
      rankFunc = function(x) {
        return x;
      };
    }
    if (numToReturn === 1) {
      return [max(arr, rankFunc)];
    } else {
      ranked = arr.map(function(el) {
        return {
          el: el,
          rank: rankFunc(el)
        };
      });
      ranked.sort(function(a, b) {
        return b.rank - a.rank;
      });
      return ranked.slice(0, +(numToReturn - 1) + 1 || 9e9).map(function(el) {
        return el.el;
      });
    }
  };

  module.exports = {
    max: max,
    flatten: flatten,
    topMax: topMax
  };

}).call(this);


},{}]},{},[1])
;