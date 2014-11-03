COMPILE=lessc

ARGS=-x

all: nice.css course-search.css

clean:
	rm -f *.css

nice.css: nice.less
	$(COMPILE) $(ARGS) nice.less > nice.css

course-search.css: course-search.less
	$(COMPILE) $(ARGS) course-search.less > course-search.css
