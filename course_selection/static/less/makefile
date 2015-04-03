COMPILE=lessc

ARGS=-x

all: nice.css course-search.css calendar.css queue.css course-evaluation.css

clean:
	rm -f *.css

nice.css: nice.less
	$(COMPILE) $(ARGS) nice.less > nice.css

course-search.css: course-search.less
	$(COMPILE) $(ARGS) course-search.less > course-search.css

calendar.css: calendar.less
	$(COMPILE) $(ARGS) calendar.less > calendar.css

queue.css: queue.less
	$(COMPILE) $(ARGS) queue.less > queue.css

course-evaluation.css: course-evaluation.less
	$(COMPILE) $(ARGS) course-evaluation.less > course-evaluation.css
