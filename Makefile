# folders
BIN          = $(NODE_MODULES)/.bin
BUILDCSS     = ./public/css
BUILDJS      = ./public/js
DATA         = ./data
NODE_MODULES = ./node_modules
SRC          = ./src

# files
MAIN         = $(SRC)/main.js
MAPFILE      = main.min.map

all: jshint jsonlint customDataChecks $(BUILDJS)/main.min.js $(BUILDCSS)/main.min.css

jshint:
	$(BIN)/jshint $(SRC)/*

jsonlint:
	$(BIN)/jsonlint --quiet $(DATA)/*

customDataChecks:
	node $(SRC)/customDataChecks.js

$(BUILDJS)/main.min.js: $(BUILDJS)/main.js
	$(BIN)/uglifyjs $^ \
  -o $@ \
  -c -m \
  --source-map $(BUILDJS)/$(MAPFILE) \
  --source-map-root ../../ \
  --source-map-url ./$(MAPFILE) \
  --comments \
  --stats

$(BUILDJS)/main.js: $(MAIN) $(SRC)/utils.js $(DATA)/animations.json $(NODE_MODULES)/jquery $(NODE_MODULES)/zeroclipboard/dist/ZeroClipboard.js
	$(BIN)/browserify $(MAIN) -o $@

$(BUILDCSS)/main.min.css: $(BUILDCSS)/animations.css $(BUILDCSS)/style.prefixed.css $(BUILDCSS)/flaticon.css $(BUILDCSS)/prism.css
	$(BIN)/cleancss $^ -o $(BUILDCSS)/main.min.css -d

$(BUILDCSS)/animations.css: $(DATA)/animations.json $(SRC)/ToCss.js $(SRC)/makeAnimationsCss.js
	node $(SRC)/makeAnimationsCss.js

$(BUILDCSS)/style.prefixed.css: $(BUILDCSS)/style.css
	$(BIN)/autoprefixer -o $@ $^

clean:
	$(RM) $(BUILDJS)/main.js
	$(RM) $(BUILDJS)/main.min.js
	$(RM) $(BUILDJS)/main.min.map
	$(RM) $(BUILDCSS)/animations.css
	$(RM) $(BUILDCSS)/style.prefixed.css
	$(RM) $(BUILDCSS)/main.min.css

.PHONY: all jshint jsonlint customDataChecks clean