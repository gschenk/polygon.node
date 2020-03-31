# polygon.node
Returns the area of the smallest convex polygon that encloses a point cloud. Prototype in ES6 Java Scipt for Node.

# Notes

## Definitons
* `x`, `y` are Cartesian coordinates
* `R_i` is the position vector to a point in the x-y plane
* `{R_i}` a set of `n` points
* A polygon P consists of `h` nodes `k` and edges `E`
* An edge `E_i` connects two nodes `N_k`, `N_l`
* Any edge `E_i'` of polygon P must not intersect with any other edge `{E_i}` of polygon P
* A convex polygon is a polygon whose internal angles are smaller than PI
* The convex hull to `{R_i}` is a convex polygon that:
    * encloses all points `{R_i}`
    * whose set of nodes `{N_k}` is a subset of the set of points `{R_i}`

## Polygon Strategies
### Cases
- Single point, one node, no edge, no area.
- Two points, two nodes, one edge, no area.
- Three points, triangle.
    - unless on a line (position vectors linear dependent)
- Few points
    - contain lots of dupes, might reduce to trivial cases
    - filter for dupes after read
    - get area by triangulating

- Many points, computation time determined by complexity
    - filtering for dupes too expensive O(n log n)
    - ordering all too expensive O(n log n) (in two dims)
    - finding extrema only O(n)
    - span polygon 
    - span polygon by extreme points
    - filter swaths of points inside that polygon
       - note: that's apparently Akl-Toussaint heuristics
    - [optional] put outside points in clases of points before next algorithm

## Algorithm, final
- [x] filter duplicates when `n<NMAX` O(n log n)
- [x] find points `{P_i}_e` extrema along cardinal and diagonal directions O(n)
- [x] the extreme points span a polygon `P_0` 
- [x]identify degenerate case `h=1` (point) END Area 0 
- [x] define a centre `C`, geometric mean of extreme points `{P_i}_e` 
- [x] create edges 
    - [x] store determinant of vectors `N_a, C_i` and `N_a, N_b` 
- [x] add edges to `P_0` 
- [x] identify collinearity, degenerate `h=2` END Area = 0 O(h) 
- [x] check validity of polygon `P_0` (drop when not needed) 
    - [x] edges must be ordered into closed chain O(h) 
        - all nodes complete, all edge-centre determinants same sign
    - edges musst not intersect O(h^2) _Shan't do:_ ensure by careful polygon generation]
- [x] determine for all points if outside of any edge O(n h) 
    - for each edge:
    - assume reference frame of first node in edge `N_a`
    - [x] calculate determinant of position vectors `P_i` and `N_b` 
    - [x] find maximum angle of outside points (det^2 / norm^2) 
    - [x] store next node point in edge 
- [x] create final poly by doing for each poly edge 
    - if there are no points, add edge and nodes to final poly `P_f`
    - maximum angle point is a new node in `P_f` `P_i` -> `N_j`, `(N_a, N_j)` -> `E_j`
    - create new un-polyed edge `E'_j`, repeat search with points outside `E_i`
        - if there are no points `E'_j` is a node in `P_f` continue with `E_i+1`
- [x] ensure that points already identified outside one edge are filtered out 
- [x] area of `P_f` is half the sum of its edge's determinants to centre 

### Improvement:
Identify nearly vertical or horizontal edges. Filter out all points in the centre-wards half-space behind the 
node closest in `x` or `y` direction to the centre.

## brainstorming strategies
### grow order of polygon
- Put origin into point closest to the centre
- switch to polar coordinates
- take three furthest points as nodes of a triangle
- check if origin is inside triangle ( sum of polar angles > PI )
- take point `R_i` the furthest from origin that is not a node
    - check if other point `R_i` is within triangle
    - check only the edge for wich the polar angle `phi_i` is in-between it's nodes' polar angles
- make edges with nodes with two nearest polar angles to that of the new node 

## rotate lines to find edge
- take an extreme point ( `x = max(x_1 x_N), y = max(y_1 .. y_N)` ) this is node `E_0`
- set origin to `E_0` and get polar angle of all points `{R_n}`
- the extreme phi values are new nodes `E_1`, `E_2`, for the highest and the lowest phi, respectively.
- set origin to `E_1`, get polar angle of all node-free points and `E_2`
- the next node the point with largest phi is `E_3`, unless it is `E_2`
- :wqcontinue

This is equivalent to "Gift Wrapping" algorith or "Jarvis March" complexity `O(n h)`, where `h` are hull points

Very simple, no deleting or re-assigning of edges, many coordinate transforms.

## triangulation
- order points by a cardinal direction
- form triangle from first three points
- take next point
- form edge to all nodes and discard edges that intersect with any other edge

O()
Advantage, provides area.

## incremental growth
- pick three points arbitrarily and span a triangle
- pick another point `r_i`
- check for all edges if `r_i` is on the same side of the edge's line as other nodes
- if not make it a new node of polygon, remove edge it was outside of

## get rid of as many inner points as possible
- get the largest orthogonal rectangle that is within a

Test if a point is on the same side of a line than another expensive (best rotate ref frame first)
requires O! checks.

## maybe useful
polar vector addition (without cartesian)
https://math.stackexchange.com/a/1365667/744377

convex hull
https://en.wikipedia.org/wiki/Convex_hull

S-hull: a fast radial sweep-hull routine
https://arxiv.org/pdf/1604.01428.pdf

Andrew's monotone chain algorithm
http://geomalgorithms.com/a10-_hull-1.html
