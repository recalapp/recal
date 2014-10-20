COMPILE=lessc

ARGS=-x

all: nice.css

clean:
	rm -f *.css

nice.css: nice.less
	$(COMPILE) $(ARGS) nice.less > nice.css
