COMPILE=lessc

ARGS=-x

all: main.css nice.css course-search.css friend-search.css calendar.css queue.css course-evaluation.css

clean:
	rm -f *.css

main.css: main.less nice.less header.less course-search.less calendar.less modal.less
	$(COMPILE) $(ARGS) main.less > main.css

nice.css: nice.less
	$(COMPILE) $(ARGS) nice.less > nice.css

course-search.css: course-search.less
	$(COMPILE) $(ARGS) course-search.less > course-search.css

friend-search.css: friend-search.less
	$(COMPILE) $(ARGS) friend-search.less > friend-search.css

calendar.css: calendar.less
	$(COMPILE) $(ARGS) calendar.less > calendar.css

queue.css: queue.less
	$(COMPILE) $(ARGS) queue.less > queue.css

course-evaluation.css: course-evaluation.less
	$(COMPILE) $(ARGS) course-evaluation.less > course-evaluation.css
