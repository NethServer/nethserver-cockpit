'use strict';

/**
 * @ngdoc function
 * @name systemAngularApp.controller:DiskUsageCtrl
 * @description
 * # DiskUsageCtrl
 * Controller of the systemAngularApp
 */
angular.module('systemAngularApp')
  .controller('DiskUsageCtrl', function ($scope, $filter) {
    // controller objects
    $scope.objects = {
      updatedAt: '',
      onLoad: false
    };

    $scope.view = {
      isLoaded: false
    };

    $scope.diskUpdateAt = function () {
      nethserver.system.disks.getUpdatedUsage().then(function (updated) {
        $scope.objects.updatedAt = updated;
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
    };
    $scope.diskUpdateAt();

    $scope.getJSONUsage = function () {
      nethserver.system.disks.getJSONUsage().then(function (json) {
        $scope.view.isLoaded = true;
        var cv = $.duc();
        cv(JSON.parse(json));
        $scope.$apply();
      }, function (err) {
        console.error(err);
      });
    };
    $scope.getJSONUsage();

    $scope.updateJSONUsage = function () {
      $scope.objects.onLoad = true;
      nethserver.system.disks.updateJSONUsage().then(function (result) {
        $scope.diskUpdateAt();
        $scope.getJSONUsage();
        $scope.objects.onLoad = false;

        // notification
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Updated'),
          message: $filter('translate')('Disk usage data updated with success'),
          status: 'success',
        });
        $scope.$apply();
      }, function (err) {
        console.error(err);

        // notification
        $scope.notifications.add({
          type: 'info',
          title: $filter('translate')('Error'),
          message: $filter('translate')('Disk udage data not updated'),
          status: 'danger',
        });
        $scope.$apply();
      });
    };

    // disk draw methods (using d3.js)
    (function ($) {

      $.duc = function () {

        // Dimensions of sunburst.
        var width = window.innerWidth;
        var height = window.innerHeight;
        var radius = Math.min(height, width) / 3;

        var total = 0;
        var breadCumbText = window.innerWidth * 6 / 1920;

        var baseDir = '/';
        var arcDefault;

        // Total size of all segments; we set this later, after loading the data.
        var totalSize = 0;

        var x = d3.scale.linear()
          .range([0, 2 * Math.PI]);

        var y = d3.scale.sqrt()
          .range([0, radius]);

        var color = d3.scale.category10();

        var svg = d3.select("#chart").append("svg:svg")
          .attr("width", width)
          .attr("height", height)
          .append("svg:g")
          .attr("id", "container")
          .attr("transform", "translate(" + (width) / 2 + "," + height / 2.3 + ")");

        var partition = d3.layout.partition()
          .value(function (d) {
            return d.size_actual;
          });

        var arc = d3.svg.arc()
          .startAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
          })
          .endAngle(function (d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
          })
          .innerRadius(function (d) {
            return Math.max(0, y(d.y));
          })
          .outerRadius(function (d) {
            return Math.max(0, y(d.y + d.dy));
          });

        // Keep track of the node that is currently being displayed as the root.
        var node;
        var path;

        // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
        var b = {
          w: window.innerWidth * 80 / 1920,
          h: 20,
          s: 3,
          t: 10
        };

        function createVisualization(json) {
          var root = json.duc;
          arcDefault = root;
          node = root;

          path = svg.datum(root).selectAll("path")
            .data(partition.nodes)
            .enter().append("svg:path")
            .attr("d", arc)
            .attr("fill-rule", "evenodd")
            .style("fill", function (d) {
              return color(d.name);
            })
            .on("click", click)
            .on("dblclick", gotoBase)
            .on("mouseover", mouseover)
            .each(stash);

          // Add the mouseleave handler to the bounding circle.
          d3.select("#container").on("mouseleave", mouseleave);

          d3.selectAll("input").on("change", function change() {
            var value = this.value === "count" ?
              function () {
                return 1;
              } :
              function (d) {
                return d.size_actual;
              };

            path
              .data(partition.value(value).nodes)
              .transition()
              .duration(250)
              .attrTween("d", arcTweenData);
          });

          var sizeFolder = document.getElementById('sizeFolder');
          sizeFolder.innerHTML = filesize(root.size_actual);

          // Basic setup of page elements.
          initializeBreadcrumbTrail();

          function click(d) {
            node = d;
            path.transition()
              .duration(250)
              .attrTween("d", arcTweenZoom(d));
          }

          function gotoBase() {
            path.transition()
              .duration(250)
              .attrTween("d", arcTweenZoom(arcDefault));
          }

        }

        d3.select(self.frameElement).style("height", height + "px");

        $.reset = function () {
          path.transition()
            .duration(250)
            .attrTween("d", arcTweenZoom(arcDefault));
        }

        function mouseleave(d) {
          d3.selection.prototype.first = function () {
            return d3.select(this[0][0]);
          };
          // Hide the breadcrumb trail
          d3.select("#trail")
            .style("visibility", "hidden");

          // Deactivate all segments during transition.
          d3.selectAll("path").on("mouseover", null);

          // Transition each segment to full opacity and then reactivate it.
          d3.selectAll("path")
            .transition()
            .duration(1)
            .style("opacity", 1)
            .each("end", function () {
              d3.select(this).on("mouseover", mouseover);
            });
          //var rootElem = d3.selectAll("path").first().style("opacity", 1)


          d3.select("#nameFolder")
            .text("/");

          d3.select("#sizeFolder")
            .text(filesize(d.size_actual));
        }

        function mouseover(d) {

          if (d.name)
            d3.select("#nameFolder")
            .text(truncate(d.name, 18));
          else
            d3.select("#nameFolder")
            .text(baseDir);


          d3.select("#sizeFolder")
            .text(filesize(d.size_actual));

          d3.select("#explanation")
            .style("visibility", "");



          var sequenceArray = getAncestors(d);
          updateBreadcrumbs(sequenceArray, d.size_actual);
          // Fade all the segments.
          d3.selectAll("path")
            .style("opacity", 0.3);

          // Then highlight only those that are an ancestor of the current segment.
          svg.selectAll("path")
            .filter(function (node) {
              if (node.root)
                return node;
              return (sequenceArray.indexOf(node) >= 0);
            })
            .style("opacity", 1);

        }

        function getAncestors(node) {
          var path = [];
          var current = node;
          while (current.parent) {
            path.unshift(current);
            current = current.parent;
          }
          return path;
        }

        function initializeBreadcrumbTrail() {
          // Add the svg area.
          var trail = d3.select("#sequence").append("svg:svg")
            .attr("width", width)
            .attr("height", 20)
            .attr("id", "trail");
          // Add the label at the end, for the percentage.
          trail.append("svg:text")
            .attr("id", "endlabel")
            .style("fill", "#000");
        }

        // Generate a string that describes the points of a breadcrumb polygon.
        function breadcrumbPoints(d, i) {
          var points = [];
          points.push("0,0");
          points.push(b.w + ",0");
          points.push(b.w + b.t + "," + (b.h / 2));
          points.push(b.w + "," + b.h);
          points.push("0," + b.h);
          if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
            points.push(b.t + "," + (b.h / 2));
          }
          return points.join(" ");
        }

        // Update the breadcrumb trail to show the current sequence and percentage.
        function updateBreadcrumbs(nodeArray, percentageString) {

          // Data join; key function combines name and depth (= position in sequence).
          var g = d3.select("#trail")
            .selectAll("g")
            .data(nodeArray, function (d) {
              return d.name + d.depth;
            });

          // Add breadcrumb and label for entering nodes.
          var entering = g.enter().append("svg:g");

          entering.append("svg:polygon")
            .attr("points", breadcrumbPoints)
            .style("fill", function (d) {
              return color(d.name);
            });

          entering.append("svg:text")
            .attr("x", (b.w + b.t) / 2)
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
              return truncate(d.name, breadCumbText);
            });

          // Set position for entering and updating nodes.
          g.attr("transform", function (d, i) {
            return "translate(" + i * (b.w + b.s) + ", 0)";
          });

          // Remove exiting nodes.
          g.exit().remove();

          // Now move and update the percentage at the end.
          d3.select("#trail").select("#endlabel")
            .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")

          // Make the breadcrumb trail visible, if it's hidden.
          d3.select("#trail")
            .style("visibility", "");

        }

        function truncate(n, len) {
          if (n) {
            var ext = n.substring(n.length, n.length).toLowerCase();
            var filename = n.replace(ext, '');
            if (filename.length < len) {
              return n;
            }
            filename = filename.substr(0, len) + (n.length > len ? '...' : '');
            return filename + ext;
          }
        };

        // Setup for switching data: stash the old values for transition.
        function stash(d) {
          d.x0 = d.x;
          d.dx0 = d.dx;
        }

        // When switching data: interpolate the arcs in data space.
        function arcTweenData(a, i) {
          var oi = d3.interpolate({
            x: a.x0,
            dx: a.dx0
          }, a);

          function tween(t) {
            var b = oi(t);
            a.x0 = b.x;
            a.dx0 = b.dx;
            return arc(b);
          }
          if (i == 0) {
            // If we are on the first arc, adjust the x domain to match the root node
            // at the current zoom level. (We only need to do this once.)
            var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
            return function (t) {
              x.domain(xd(t));
              return tween(t);
            };
          } else {
            return tween;
          }
        }

        // When zooming: interpolate the scales.
        function arcTweenZoom(d) {
          var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
          return function (d, i) {
            return i ?
              function (t) {
                return arc(d);
              } :
              function (t) {
                x.domain(xd(t));
                y.domain(yd(t)).range(yr(t));
                return arc(d);
              };
          };
        }

        return createVisualization;
      };

    })(jQuery);

  });
