COMPILE=lessc

ARGS=-x

all: popup.css

clean:
	rm -f *.css

popup.css: popup.less
	$(COMPILE) $(ARGS) popup.less > popup.css
