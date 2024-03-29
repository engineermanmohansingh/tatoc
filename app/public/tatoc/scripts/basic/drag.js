

/*
Copyright (c) 2008-2011, www.redips.net All rights reserved.
Code licensed under the BSD License: http://www.redips.net/license/
http://www.redips.net/javascript/drag-and-drop-table-content/
Version 3.2.1
Mar 21, 2011.
*/

/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false */

/* reveal module-pattern */

/* enable strict mode */
"use strict";

// create REDIPS namespace (if is not already defined in another REDIPS package)
var REDIPS = REDIPS || {};

REDIPS.drag = (function () {
		// methods
	var	init,						// initialization
		init_tables,				// table initialization
		enable_drag,				// function attaches / detaches onmousedown and onscroll event handlers for DIV elements
		img_onmousemove,			// needed to set onmousemove event handler for images
		handler_onmousedown,		// onmousedown handler
		table_top,					// set current table in "tables" array to the array top
		handler_onmouseup,			// onmouseup handler
		handler_onmousemove,		// onmousemove handler for the document level
		cell_changed,				// private method called from handler_onmousemove(), autoscrollX(), autoscrollY()
		handler_onresize,			// onresize window event handler
		set_trc,					// function sets current table, row and cell
		set_color,					// function sets color for the current table cell and remembers previous location and color
		box_offset,					// calculates object (box) offset (top, right, bottom, left)
		calculate_cells,			// calculates table colums and row offsets (cells dimensions)
		getScrollPosition,			// returns scroll positions in array
		autoscrollX,				// horizontal auto scroll function
		autoscrollY,				// vertical auto scroll function
		clone_object,				// clone object
		clone_limit,				// clone limit (after cloning object, take care about climit1_X or climit2_X classnames)
		elementControl,				// function returns true or false if element needs to have control
		trash_delete,				// delete DIV object
		get_style,					// function returns style value of requested object and style name
		save_content,				// scan tables, prepare query string and sent to the multiple-parameters.php
		move_object,				// move object from source cell to the target cell (source and target cells are input parameters)

		// private parameters
		obj_margin = null,			// space from clicked point to the object bounds (top, right, bottom, left)
		window_width = 0,			// window width and height (parameters are set in onload and onresize event handler)
		window_height = 0,
		scroll_width = null,		// scroll width and height of the window (it is usually greater then window)
		scroll_height = null,
		edge = {page: {x: 0, y: 0}, // autoscroll bound values for page and div as scrollable container
				div:  {x: 0, y: 0},	// closer to the edge, faster scrolling
				flag: {x: 0, y: 0}},// flags are needed to prevent multiple calls of autoscrollX and autoscrollY from onmousemove event handler
		scroll_object,				// scroll_object
		bgcolor_old = null,			// old cell background color
		scrollable_container = [],	// scrollable container areas (contains autoscroll areas, reference to the container and scroll direction)
		tables = [],				// table offsets and row offsets (initialized in onload event)
		moved_flag = 0,				// if object is moved, flag gets value 1
		cloned_flag = 0,			// if object is cloned, flag gets value 1
		cloned_id = [],				// needed for increment ID of cloned elements
		currentCell = [],			// current cell bounds: top, right, bottom, left (decrease number calls of set_trc)
		div_drag = null,			// reference to the div drag
		div_box = null,				// div drag box: top, right, bottom and left margin (decrease number calls of set_trc)
		pointer = {x: 0, y: 0},		// mouse pointer position (this properties are set in handler_onmousemove() - needed for autoscroll)
		top_position,				// top position in tables array ("clean" tables and nested tables are placed to the top of the tables array)

		// selected, previous and source table, row and cell (private parameters too)
		table = null,
		table_old = null,
		table_source = null,
		row = null,
		row_old = null,
		row_source = null,
		cell = null,
		cell_old = null,
		cell_source = null,

		// variables in the private scope revealed as public (see init() method)
		obj = false,				// (object) moved object
		obj_old = false,			// (object) previously moved object (before clicked or cloned)
		hover_color = '#E7AB83',	// (string) hover color
		bound = 25,					// (integer) bound width for autoscroll
		speed = 20,					// (integer) scroll speed in milliseconds
		only = {div: [],			// (array) DIVid -> classname, defined DIV elements can be placed only to the marked table cell with class name 'only'
				cname: 'only',		// (string) class name for marked cells (default is 'only') - only defined objects can be placed there
				other: 'deny'},		// (string) allow / deny dropping marked objects with "only" to other cells
		mark = {action: 'deny',
				cname: 'mark',
				exception: []},
		border = 'solid',			// (string) border style for enabled element
		border_disabled = 'dotted',	// (string) border style for disabled element
		trash = 'trash',			// (string) cell class name where draggable element will be destroyed
		trash_ask = true,			// (boolean) confirm object deletion (ask a question "Are you sure?" before delete)
		drop_option = 'multiple',	// (string) drop_option has the following options: multiple, single, switch, switching and overwrite
		delete_cloned = true,		// (boolean) delete cloned div if the cloned div is dragged outside of any table
		source_cell = null,			// (object) source table cell (defined in onmousedown and in onmouseup)
		current_cell = null,		// (object) current table cell (defined in onmousemove)
		previous_cell = null,		// (object) previous table cell (defined in onmousemove)
		target_cell = null,			// (object) target table cell (defined in onmouseup)

		clone_shiftKey = false;		// (boolean) if true, elements could be cloned with pressed SHIFT key



	// initialization of div drag
	init = function (dd) {
		// define local variables
		var self = this,		// assign reference to current object to "self"
			i,					// used in local for loops
			imgs,				// collect images inside div=drag
			obj_new_div;		// reference to the DIV element needed for cloned elements

		// if input parameter is undefined, then set reference to the DIV element with id=drag
		if (dd === undefined) {
			dd = 'drag';
		}
		// set reference to the div_drag
		div_drag = document.getElementById(dd);

		// append DIV id="obj_new" if DIV doesn't exist (needed for cloning DIV elements)
		// if automatic creation isn't precise, user can manually create and place element with id="obj_new" to prevent window expanding
		// to the HTML document and this code will be skipped
		if (!document.getElementById('obj_new')) {
			obj_new_div = document.createElement('div');
			obj_new_div.id = 'obj_new';
			obj_new_div.style.width = obj_new_div.style.height = '1px';
			div_drag.appendChild(obj_new_div);
		}
		// attach onmousedown event handler to the DIV elements
		// attach onscroll='calculate_cells' for DIV elements with 'scroll' in class name (prepare scrollable container areas)
		enable_drag('init');
		// initialize table array (it should go after enable_drag because sca is attached to the table if table belongs to the scrollable container)
		init_tables();
		// set initial window width/height, scroll width/height and define onresize event handler
		// onresize event handler calls calculate columns
		handler_onresize();
		REDIPS.event.add(window, 'resize', handler_onresize);
		// collect images inside div=drag to prevent default action of onmousemove event (needed for IE to enable dragging on image)
		imgs = div_drag.getElementsByTagName('img');
		// disable onmousemove event for images
		for (i = 0; i < imgs.length; i++) {
			REDIPS.event.add(imgs[i], 'mousemove', img_onmousemove);
		}
		// attach onscroll event to the window (needed for recalculating table cells positions)
		REDIPS.event.add(window, 'scroll', calculate_cells);
		// indexOf of needed for IE browsers ?!
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (el) {
				var i; // local variable
				for (i = 0; i < this.length; i++) {
					if (this[i] === el) {
						return i;
					}
				}
				return -1;
			};
		}
	};



	// table initialization
	init_tables = function () {
		var	i,					// loop variable
			element,			// used in searhing parent nodes of found tables below div id="drag"
			table_type,			// (integer) 2 - "clean" table; 1 - nested table; 0 - table contains nested tables
			tables_nodeList,	// live nodelist of tables found inside div=drag
			contain_nested;		// test if table contains nested tables
		// set top_position to 0
		top_position = 0;
		// collect tables inside DIV id=drag and make static nodeList
		tables_nodeList = div_drag.getElementsByTagName('table');
		// loop through tables and define table types - 0, 1, 2
		for (i = 0; i < tables_nodeList.length; i++) {
			element = tables_nodeList[i].parentNode;
			// go up through DOM and search for DIV id="drag" (dragging container)
			do {
				// DIV id="drag" is found - normal table, but this table can contain nested tables
				if (element === div_drag) {
					// search for tables beneath current table
					contain_nested = tables_nodeList[i].getElementsByTagName('table');
					// if table doesn't contain nested tables then this is "clean" table and it can go to the top of the tables array
					// "clean" table - table is not nested and doesn't contain nested tables
					if (contain_nested.length === 0) {
						// set table type (this table will be sorted to the array top)
						table_type = 2;
						// update top_position value (needed inside table_top function)
						top_position++;
					}
					// table contains nested tables (will be sorted to the table bottom)
					else {
						table_type = 0;
					}
					break;
				}
				// huh, nested table
				if (element.nodeName === 'TD') {
					table_type = 1;
					// mark table cell that contains table (needed for settings currentCell.containTable property in set_trc() - see around line 800)
					element.table = true;
					// update top_position value (needed inside table_top function)
					top_position++;
					break;
				}
				// go one level up
				element = element.parentNode;
			} while (element);
			// copy table reference to the static list
			tables[i] = tables_nodeList[i];
			// set table type (needed for sorting tables array)
			tables[i].redips_tableType = table_type;
			// add table index (needed for sorting tables array to original order in save_content() function)
			tables[i].redips_idx = i;
		}
		// sort "clean" tables and nested tables to the array top
		tables.sort(function (a, b) {
			return b.redips_tableType - a.redips_tableType;
		});
	};


	// needed to set onmousemove event handler for images (for IE to enable dragging DIV on image click)
	// used in init() function
	img_onmousemove = function () {
		return false;
	};



	// onmousedown handler
	handler_onmousedown = function (e) {
		var evt = e || window.event,	// define event (cross browser)
			offset,						// object offset
			mouseButton,				// start drag if left mouse button is pressed
			position,					// position of table or container box of table (if has position:fixed then exclude scroll offset)
			X, Y;						// X and Y position of mouse pointer
		// define X and Y position (pointer.x and pointer.y are needed in set_trc() and autoscroll methods)
		X = pointer.x = evt.clientX;
		Y = pointer.y = evt.clientY;
		// enable control for form elements
		if (elementControl(evt)) {
			return true;
		}
		// remember previous object if defined or set to the clicked object
		REDIPS.drag.obj_old = obj_old = obj || this;
		// set reference to the clicked object
		REDIPS.drag.obj = obj = this;
		// if clicked element doesn't belong to the current container than environment should be changed
		if (div_drag !== obj.redips_container) {
			div_drag = obj.redips_container;
			init_tables();
		}
		// if user has used a mouse event to increase the dimensions of the table - call calculate_cells()
		calculate_cells();
		// set high z-index if object isn't "clone" type - clone object is motionless
		if (obj.className.indexOf('clone') === -1) {
			obj.style.zIndex = 999;
		}
		// set current table in "tables" array to the array top
		table_top(obj);
		// reset old positions (do not remember old position of previous dropping)
		table_old = row_old = cell_old = null;
		// set current table, row and cell
		set_trc();
		// remember start position (table, row and cell)
		table_source = table;
		row_source   = row;
		cell_source  = cell;
		// define source cell, current cell and previous cell (needed for myhandlers)
		REDIPS.drag.source_cell = source_cell = tables[table_source].rows[row_source].cells[cell_source];
		REDIPS.drag.current_cell = current_cell = source_cell;
		REDIPS.drag.previous_cell = previous_cell = source_cell;
		// define pressed mouse button
		if (evt.which) {
			mouseButton = evt.which;
		}
		else {
			mouseButton = evt.button;
		}
		// activate onmousemove and onmouseup event handlers on document level
		// if left mouse button is pressed
		if (mouseButton === 1) {
			moved_flag  = 0; // reset moved_flag (needed for clone object in handler_onmousemove)
			cloned_flag = 0; // reset cloned_flag
			REDIPS.event.add(document, 'mousemove', handler_onmousemove);
			REDIPS.event.add(document, 'mouseup', handler_onmouseup);
			REDIPS.drag.myhandler_clicked(); // call myhandler (public method)
			// get IE (all versions) to allow dragging outside the window (?!)
			// http://stackoverflow.com/questions/1685326/responding-to-the-onmousemove-event-outside-of-the-browser-window-in-ie
			if (obj.setCapture) {
				obj.setCapture();
			}
		}
		// remember background cell color
		if (table !== null || row !== null || cell !== null) {
			bgcolor_old = tables[table].rows[row].cells[cell].style.backgroundColor;
		}
		// set table CSS position (needed for exclusion "scroll offset" if table box has position fixed)
		position = get_style(tables[table_source], 'position');
		// if table doesn't have style position:fixed then table container should be tested
		if (position !== 'fixed') {
			position = get_style(tables[table_source].parentNode, 'position');
		}
		// define object offset
		offset = box_offset(obj, position);
		// calculate ofsset from the clicked point inside element to the
		// top, right, bottom and left side of the element
		obj_margin = [Y - offset[0], offset[1] - X, offset[2] - Y, X - offset[3]];
		// dissable text selection (but not for links and form elements)
		// onselectstart is supported by IE browsers, other browsers "understand" return false in onmousedown handler
		div_drag.onselectstart = function (e) {
			evt = e || window.event;
			if (!elementControl(evt)) {
				// this lines are needed for IE8 in case when leftmouse button was clicked and SHIFT key was pressed
				// IE8 selected text anyway but document.selection.clear() prevented text selection
				if (evt.shiftKey) {
					document.selection.clear();
				}
			    return false;
			}
		};
		// disable text selection for non IE browsers
		return false;
	};


	// set current table in "tables" array to the array top
	// clicked object belongs to the table and this table should go to the array top
	// "clean" tables and nested tables will be placed to the array top, while other tables will be placed to the top position
	// top position is the highest position below set of "clean" and nested tables
	table_top = function (obj) {
		var e,		// element
			idx,	// local variable (element position in array)
			tmp;	// temporary storage (needed for exchanging array members)
		// set start element position
		e = obj.parentNode;
		// loop up until found table
		while (e && e.nodeName !== 'TABLE') {
			e = e.parentNode;
		}
		// set table index from found table
		idx = tables.indexOf(e);
		// if current table is type of 1 or 2 then place table to the array top
		// type 1 - nested table
		// type 2 - "clean" table (table is not nested and doesn't contain nested tables)
		if (e.redips_tableType > 0 && idx !== 0) {
			// save first array member to the temporary storage
			tmp = tables[0];
			// place found table to the array top
			tables[0] = tables[idx];
			// return old member to the found position
			tables[idx] = tmp;
		}
		// if table type 0 isn't on the highest possible position in the array
		// type 0 - table contains nested tables
		else if (e.redips_tableType === 0 && idx !== top_position) {
			// save member from top position to the temporary storage
			tmp = tables[top_position];
			// place found table to the top position
			tables[top_position] = tables[idx];
			// return old member to the found position
			tables[idx] = tmp;
		}
	};


	// onmouseup handler
	handler_onmouseup = function (e) {
		var evt = e || window.event,	// define event (FF & IE)
			target_table,				// needed for test if cloned element is dropped outside table
			X, Y,						// X and Y position of mouse pointer
			i,							// used in local loop
			// define target elements and target elements length needed for switching table cells
			// target_elements_length is needed because nodeList objects in the DOM are live
			// please see http://www.redips.net/javascript/nodelist-objects-are-live/
			target_elements, target_elements_length;
		// define X and Y position
		X = evt.clientX;
		Y = evt.clientY;
		// turn off autoscroll "current cell" handling (if user mouseup in the middle of autoscrolling)
		edge.flag.x = edge.flag.y = 0;
		// remove mouse capture from the object in the current document
		// get IE (all versions) to allow dragging outside the window (?!)
		// http://stackoverflow.com/questions/1685326/responding-to-the-onmousemove-event-outside-of-the-browser-window-in-ie
		if (obj.releaseCapture) {
			obj.releaseCapture();
		}
		// detach onmousemove and onmouseup event handlers
		REDIPS.event.remove(document, 'mousemove', handler_onmousemove);
		REDIPS.event.remove(document, 'mouseup', handler_onmouseup);
		// detach div_drag.onselectstart handler to enable select for IE7/IE8 browser
		div_drag.onselectstart = null;
		// reset left and top styles
		obj.style.left = 0;
		obj.style.top  = 0;
		// return z-index and position style to 'static' (this is default element position)
		obj.style.zIndex = 10;
		obj.style.position = 'static';
		// document.body.scroll... only works in compatibility (aka quirks) mode,
		// for standard mode, use: document.documentElement.scroll...
		scroll_width  = document.documentElement.scrollWidth;
		scroll_height = document.documentElement.scrollHeight;
		// reset autoscroll flags
		edge.flag.x = edge.flag.y = 0;
		// this could happen if 'clone' element is placed in unmovable table cell
		if (cloned_flag === 1 && (table === null || row === null || cell === null)) {
			obj.parentNode.removeChild(obj);
			// decrease cloned_id counter
			cloned_id[obj_old.id] -= 1;
			REDIPS.drag.myhandler_notcloned();
		}
		// if ordinary element was clicked and left button was released, but element is placed inside unmovable table cell
		else if (table === null || row === null || cell === null) {
			REDIPS.drag.myhandler_notmoved();
		}
		else {
			// if current table is in range, use table for current location
			if (table < tables.length) {
				target_table = tables[table];
				REDIPS.drag.target_cell = target_cell = target_table.rows[row].cells[cell];
			}
			// if any level of old position is undefined, then use source location
			else if (table_old === null || row_old === null || cell_old === null) {
				target_table = tables[table_source];
				REDIPS.drag.target_cell = target_cell = target_table.rows[row_source].cells[cell_source];
			}
			// or use the previous location
			else {
				target_table = tables[table_old];
				REDIPS.drag.target_cell = target_cell = target_table.rows[row_old].cells[cell_old];
			}
			// return background color for destination color (cell had hover color)
			target_cell.style.backgroundColor = bgcolor_old;

			// element was not moved - button was clicked and released
			// call myhandler_notmoved handler and place clicked element to the bottom of TD (if table cell contains more than one element)
			if (moved_flag === 0) {
				REDIPS.drag.myhandler_notmoved();
				target_cell.appendChild(obj);
			}
			// delete cloned object if dropped on the start position
			else if (cloned_flag === 1 && table_source === table && row_source === row && cell_source === cell) {
				obj.parentNode.removeChild(obj);
				// decrease cloned_id counter
				cloned_id[obj_old.id] -= 1;
				REDIPS.drag.myhandler_notcloned();
			}
			// delete cloned object if dropped outside current table and delete_cloned flag is true
			else if (cloned_flag === 1 && REDIPS.drag.delete_cloned === true &&
					(X < target_table.offset[3] || X > target_table.offset[1] || Y < target_table.offset[0] || Y > target_table.offset[2])) {
				obj.parentNode.removeChild(obj);
				// decrease cloned_id counter
				cloned_id[obj_old.id] -= 1;
				REDIPS.drag.myhandler_notcloned();
			}
			// remove object if destination cell has "trash" in class name
			else if (target_cell.className.indexOf(REDIPS.drag.trash) > -1) {
				// remove child from DOM (node still exists in memory)
				obj.parentNode.removeChild(obj);
				// if parameter trash_ask is "true", confirm deletion (function trash_delete is at bottom of this script)
				if (REDIPS.drag.trash_ask) {
					setTimeout(trash_delete, 10);
				}
				// else call myhandler_deleted handler (reference to the obj still exists)
				else {
					REDIPS.drag.myhandler_deleted();
					// if object is cloned, update climit1_X or climit2_X classname
					if (cloned_flag === 1) {
						clone_limit();
					}
				}
			}
			else if (REDIPS.drag.drop_option === 'switch') {
				// remove dragged element from DOM (source cell) - node still exists in memory
				obj.parentNode.removeChild(obj);
				// move object from the destination to the source cell
				target_elements = target_cell.getElementsByTagName('DIV');
				target_elements_length = target_elements.length;
				for (i = 0; i < target_elements_length; i++) {
					// source_cell is defined in onmouseup
					if (target_elements[0] !== undefined) { //fixes issue with nested DIVS
						source_cell.appendChild(target_elements[0]); // '0', not 'i' because NodeList objects in the DOM are live
					}
				}
				// and finaly, append dragged object to the destination table cell
				target_cell.appendChild(obj);
				// if destination element exists, than elements are switched
				if (target_elements_length) {
					// call myhandler_switched because clone_limit could call myhandler_clonedend1 or myhandler_clonedend2
					REDIPS.drag.myhandler_switched();
					// and myhandler_dropped
					REDIPS.drag.myhandler_dropped(target_cell);
					// if object is cloned, update climit1_X or climit2_X classname
					if (cloned_flag === 1) {
						clone_limit();
					}
				}
				// otherwise element is dropped to the empty cells
				else {
					// call myhandler_dropped because clone_limit could call myhandler_clonedend1 or myhandler_clonedend2
					REDIPS.drag.myhandler_dropped(target_cell);
					// if object is cloned, update climit1_X or climit2_X classname
					if (cloned_flag === 1) {
						clone_limit();
					}
				}
			}
			// overwrite destination table cell with dragged content
			else if (REDIPS.drag.drop_option === 'overwrite') {
				// remove objects from the destination table cell
				target_elements        = target_cell.getElementsByTagName('DIV');
				target_elements_length = target_elements.length;
				for (i = 0; i < target_elements_length; i++) {
					// remove child DIV elements from target cell
					target_cell.removeChild(target_elements[0]); // '0', not 'i' because NodeList objects in the DOM are live
				}
				// append object to the target cell
				target_cell.appendChild(obj);
				// call myhandler_dropped because clone_limit could call myhandler_clonedend1 or myhandler_clonedend2
				REDIPS.drag.myhandler_dropped(target_cell);
				// if object is cloned, update climit1_X or climit2_X classname
				if (cloned_flag === 1) {
					clone_limit();
				}
			}
			// else append object to the cell and call myhandler_dropped
			else {
				// append object to the target cell
				target_cell.appendChild(obj);
				// call myhandler_dropped because clone_limit could call myhandler_clonedend1 or myhandler_clonedend2
				REDIPS.drag.myhandler_dropped(target_cell);
				// if object is cloned, update climit1_X or climit2_X classname
				if (cloned_flag === 1) {
					clone_limit();
				}
			}
			// force naughty browsers (IE6, IE7 ...) to redraw source and destination row (element.className = element.className does the trick)
			// but careful (table_source || row_source could be null if clone element was clicked in denied table cell)
			if (table_source !== null && row_source !== null) {
				tables[table_source].rows[row_source].className = tables[table_source].rows[row_source].className;
			}
			target_cell.parentNode.className = target_cell.parentNode.className;
			// recalculate table cells and scrollers because cell content could change row dimensions
			calculate_cells();
		}
		// reset old positions
		table_old = row_old = cell_old = null;
	};



	// onmousemove handler for the document level
	// activated after left mouse button is pressed on draggable element
	handler_onmousemove = function (e) {
		var evt = e || window.event,	// define event (FF & IE)
			bound = REDIPS.drag.bound,	// read "bound" public property (maybe code will be faster, and it will be easier to reference in onmousemove handler)
			sca,						// current scrollable container area
			X, Y,						// X and Y position of mouse pointer
			i,							// needed for local loop
			scrollPosition;				// scroll position variable needed for autoscroll call
		// define X and Y position (pointer.x and pointer.y are needed in set_trc() and autoscroll methods)
		X = pointer.x = evt.clientX;
		Y = pointer.y = evt.clientY;
		// if moved_flag isn't set and object has clone in class name or clone_shiftKey is enabled and shift key is pressed
		// then duplicate object, set cloned flag and call myhandler_cloned
		if (moved_flag === 0 && (obj.className.indexOf('clone') > -1 || (REDIPS.drag.clone_shiftKey === true && evt.shiftKey))) {
			clone_object();
			cloned_flag = 1;
			REDIPS.drag.myhandler_cloned();
			// set color for the current table cell and remembers previous location and color
			set_color();
		}
		// object is moved
		else if (moved_flag === 0) {
			// get IE (all versions) to allow dragging outside the window (?!)
			// this was needed here also - despite setCaputure in onmousedown
			if (obj.setCapture) {
				obj.setCapture();
			}
			// set style to fixed to allow dragging DIV object
			obj.style.position = 'fixed';
			// call calculate cells for case where moved element changed cell dimension
			// place 3 elements in the same cell in example08 and try to move one out of the table cell
			calculate_cells();
			// set current table, row and column
			set_trc();
			// set color for the current table cell and remembers previous location and color
			set_color();
			// call myhandler_moved
			REDIPS.drag.myhandler_moved();
		}
		// set moved_flag
		moved_flag = 1;
		// set left and top styles for the moved element if element is inside window
		// this conditions will stop element on window bounds
		if (X > obj_margin[3] && X < window_width - obj_margin[1]) {
			obj.style.left = (X - obj_margin[3]) + "px";
		}
		if (Y > obj_margin[0] && Y < window_height - obj_margin[2]) {
			obj.style.top  = (Y - obj_margin[0]) + "px";
		}
		// set current table, row and cell (this condition should spare CPU):
		// 1) if mouse pointer is inside DIV id="drag"
		// 2) and autoscroll is not working
		// 3) and current table contains nested table or cursor is outside of current cell
		if (X < div_box[1] && X > div_box[3] && Y < div_box[2] && Y > div_box[0] &&
			edge.flag.x === 0 && edge.flag.y === 0 &&
			((currentCell.containTable === 1) ||
			(X < currentCell[3] || X > currentCell[1] || Y < currentCell[0] || Y > currentCell[2]))) {
			// set current table row and table cell
			set_trc();
			// if new location is inside table and new location is different then old location
			cell_changed();
		}
		// calculate horizontally crossed page bound
		edge.page.x = bound - (window_width / 2  > X ? X - obj_margin[3] : window_width - X - obj_margin[1]);
		// if element crosses page bound then set scroll direction and call auto scroll
		if (edge.page.x > 0) {
			// in case when object is only half visible
			if (edge.page.x > bound) {
				edge.page.x = bound;
			}
			// get horizontal window scroll position
			scrollPosition = getScrollPosition()[0];
			// set scroll direction
			edge.page.x *= X < window_width / 2 ? -1 : 1;
			// if page bound is crossed and this two cases aren't met:
			// 1) scrollbar is on the left and user wants to scroll left
			// 2) scrollbar is on the right and user wants to scroll right
			if (!((edge.page.x < 0 && scrollPosition <= 0) || (edge.page.x > 0 && scrollPosition >= (scroll_width - window_width)))) {
				// fire autoscroll function (this should happen only once)
				if (edge.flag.x++ === 0) {
					// reset onscroll event
					REDIPS.event.remove(window, 'scroll', calculate_cells);
					// call window autoscroll
					autoscrollX(window);
				}
			}
		}
		else {
			edge.page.x = 0;
		}
		// calculate vertically crossed page bound
		edge.page.y = bound - (window_height / 2 > Y ? Y - obj_margin[0] : window_height - Y - obj_margin[2]);
		// if element crosses page bound
		if (edge.page.y > 0) {
			// set max crossed bound
			if (edge.page.y > bound) {
				edge.page.y = bound;
			}
			// get vertical window scroll position
			scrollPosition = getScrollPosition()[1];
			// set scroll direction
			edge.page.y *= Y < window_height / 2 ? -1 : 1;
			// if page bound is crossed and this two cases aren't met:
			// 1) scrollbar is on the page top and user wants to scroll up
			// 2) scrollbar is on the page bottom and user wants to scroll down
			if (!((edge.page.y < 0 && scrollPosition <= 0) || (edge.page.y > 0 && scrollPosition >= (scroll_height - window_height)))) {
				// fire autoscroll (this should happen only once)
				if (edge.flag.y++ === 0) {
					// reset onscroll event
					REDIPS.event.remove(window, 'scroll', calculate_cells);
					// call window autoscroll
					autoscrollY(window);
				}
			}
		}
		else {
			edge.page.y = 0;
		}
		// test if dragged object is in scrollable container
		// this code will be executed only if scrollable container (DIV with overflow other than 'visible) exists on page
		for (i = 0; i < scrollable_container.length; i++) {
			// set current scrollable container area
			sca = scrollable_container[i];
			// if dragged object is inside scrollable container and scrollable container has enabled autoscroll option
			if (sca.autoscroll && X < sca.offset[1] && X > sca.offset[3] && Y < sca.offset[2] && Y > sca.offset[0]) {
				// calculate horizontally crossed page bound
				edge.div.x = bound - (sca.midstX  > X ? X - obj_margin[3] - sca.offset[3] : sca.offset[1] - X - obj_margin[1]);
				// if element crosses page bound then set scroll direction and call auto scroll
				if (edge.div.x > 0) {
					// in case when object is only half visible (page is scrolled on that object)
					if (edge.div.x > bound) {
						edge.div.x = bound;
					}
					// set scroll direction: negative - left, positive - right
					edge.div.x *= X < sca.midstX ? -1 : 1;
					// remove onscroll event handler and call autoscrollY function only once
					if (edge.flag.x++ === 0) {
						REDIPS.event.remove(sca.div, 'scroll', calculate_cells);
						autoscrollX(sca.div);
					}
				}
				else {
					edge.div.x = 0;
				}
				// calculate vertically crossed page bound
				edge.div.y = bound - (sca.midstY  > Y ? Y - obj_margin[0] - sca.offset[0] : sca.offset[2] - Y - obj_margin[2]);
				// if element crosses page bound then set scroll direction and call auto scroll
				if (edge.div.y > 0) {
					// in case when object is only half visible (page is scrolled on that object)
					if (edge.div.y > bound) {
						edge.div.y = bound;
					}
					// set scroll direction: negative - up, positive - down
					edge.div.y *= Y < sca.midstY ? -1 : 1;
					// remove onscroll event handler and call autoscrollY function only once
					if (edge.flag.y++ === 0) {
						REDIPS.event.remove(sca.div, 'scroll', calculate_cells);
						autoscrollY(sca.div);
					}
				}
				else {
					edge.div.y = 0;
				}
				// break the loop (checking for other scrollable containers is not needed)
				break;
			}
			// otherwise (I mean dragged object isn't inside any of scrollable container) reset crossed edge
			else {
				edge.div.x = edge.div.y = 0;
			}
		}
		// stop all propagation of the event in the bubbling phase.
		// (save system resources by turning off event bubbling / propagation)
		evt.cancelBubble = true;
		if (evt.stopPropagation) {
			evt.stopPropagation();
		}
	};



	// private method called from handler_onmousemove(), autoscrollX(), autoscrollY()
	cell_changed = function () {
		if (table < tables.length && (table !== table_old || row !== row_old || cell !== cell_old)) {
			// set cell background color to the previous cell
			if (table_old !== null && row_old !== null && cell_old !== null) {
				// set background colors for the previous table cell
				tables[table_old].rows[row_old].cells[cell_old].style.backgroundColor = bgcolor_old;
				// define previous table cell
				REDIPS.drag.previous_cell = previous_cell = tables[table_old].rows[row_old].cells[cell_old];
				// define current table cell
				REDIPS.drag.current_cell = current_cell = tables[table].rows[row].cells[cell];
				// if drop option is 'switching' then replace content from current cell to the previous cell
				if (REDIPS.drag.drop_option === 'switching') {
					// move objects from current cell to the previous cell
					move_object(current_cell, previous_cell);
					// recalculate table cells again (because cell content could change row dimensions)
					calculate_cells();
					// set current table cell again (because cell content can be larger then cell itself)
					set_trc();
				}
				// target cell changed - call public handler
				REDIPS.drag.myhandler_changed();
			}
			// set color for the current table cell and remembers previous location and color
			set_color();
		}
	};



	// onresize window event handler
	// this event handler sets window_width and window_height variables used in onmousemove handler
	handler_onresize = function () {
		// Non-IE
		if (typeof(window.innerWidth) === 'number') {
			window_width  = window.innerWidth;
			window_height = window.innerHeight;
		}
		// IE 6+ in 'standards compliant mode'
		else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			window_width  = document.documentElement.clientWidth;
			window_height = document.documentElement.clientHeight;
		}
		// IE 4 compatible
		else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
			window_width  = document.body.clientWidth;
			window_height = document.body.clientHeight;
		}
		// set scroll size (onresize, onload and onmouseup event)
		scroll_width  = document.documentElement.scrollWidth;
		scroll_height = document.documentElement.scrollHeight;
		// calculate colums and rows offset (cells dimensions)
		calculate_cells();
	};



	// function sets current table, row and cell
	set_trc = function () {
		var cell_current,	// define current cell (needed for some test at the function bottom)
			row_offset,		// row offsets for the selected table (row box bounds)
			cells,			// number of cells in the selected row
			has_content,	// has_content flag
			mark_found,		// (boolean) found "mark" class name
			only_found,		// (boolean) found "only" class name
			single_cell,	// table cell can be defined as single
			tos = [],		// table offset
			X, Y,			// X and Y position of mouse pointer
			i;				// used in local loop
		// prepare X and Y position of mouse pointer
		X = pointer.x;
		Y = pointer.y;
		// find table below draggable object
		for (table = 0; table < tables.length; table++) {
			// prepare table offset
			tos[0] = tables[table].offset[0]; // top
			tos[1] = tables[table].offset[1]; // right
			tos[2] = tables[table].offset[2]; // bottom
			tos[3] = tables[table].offset[3]; // left
			// if table belongs to the scrollable container then set scrollable container offset if needed
			// in case when some parts of table are hidden (for example with "overflow: auto")
			if (tables[table].sca !== undefined) {
				tos[0] = tos[0] > tables[table].sca.offset[0] ? tos[0] : tables[table].sca.offset[0]; // top
				tos[1] = tos[1] < tables[table].sca.offset[1] ? tos[1] : tables[table].sca.offset[1]; // right
				tos[2] = tos[2] < tables[table].sca.offset[2] ? tos[2] : tables[table].sca.offset[2]; // bottom
				tos[3] = tos[3] > tables[table].sca.offset[3] ? tos[3] : tables[table].sca.offset[3]; // left
			}
			// mouse pointer is inside table (or scrollable container)
			if (tos[3] < X && X < tos[1] && tos[0] < Y && Y < tos[2]) {
				// define row offsets for the selected table (row box bounds)
				row_offset = tables[table].row_offset;
				// find the current row (loop will stop at the current row; row_offset[row][0] is row top offset)
				for (row = 0; row < row_offset.length - 1 && row_offset[row][0] < Y; row++) {
					// set top and bottom cell bounds
					currentCell[0] = row_offset[row][0];
					currentCell[2] = row_offset[row + 1][0];
					// top bound of the next row
					if (Y <= currentCell[2]) {
						break;
					}
				}
				// if loop exceeds, then set bounds for the last row (offset for the last row doesn't work in IE8, so use table bounds)
				if (row === row_offset.length - 1) {
					currentCell[0] = row_offset[row][0];
					currentCell[2] = tables[table].offset[2];
				}
				// do loop - needed for rowspaned cells (if there is any)
				do {
					// set the number of cells in the selected row
					cells = tables[table].rows[row].cells.length - 1;
					// find current cell (X mouse position between cell offset left and right)
					for (cell = cells; cell >= 0; cell--) {
						// row left offset + cell left offset
						currentCell[3] = row_offset[row][3] + tables[table].rows[row].cells[cell].offsetLeft;
						// cell right offset is left offset + cell width
						currentCell[1] = currentCell[3] + tables[table].rows[row].cells[cell].offsetWidth;
						// is mouse pointer is between left and right offset, then cell is found
						if (currentCell[3] <= X && X <= currentCell[1]) {
							break;
						}
					}
				} // mouse pointer is inside table but cell not found (hmm, rowspaned cell - try in upper row)
				while (cell === -1 && row-- > 0);
				// if cell < 0 or row < 0 use the last possible location
				if (row < 0 || cell < 0) {
					table = table_old;
					row = row_old;
					cell = cell_old;
				}
				// set current cell (for easier access in test below)
				cell_current = tables[table].rows[row].cells[cell];
				// if current cell has nested table then set currentCell.containTable property
				// needed in handler_onmousemove() - see around line 567
				// "table" property of cell (TD) is set in initialization phase inside init_tables()
				if ('table' in cell_current) {
					currentCell.containTable = 1;
				}
				else {
					currentCell.containTable = 0;
				}
				// if current cell isn't trash cell, then search for marks in class name
				if (cell_current.className.indexOf(REDIPS.drag.trash) === -1) {
					// search for 'only' class name
					only_found = cell_current.className.indexOf(REDIPS.drag.only.cname) > -1 ? true : false;
					// if current cell is marked with 'only' class name
					if (only_found === true) {
						// marked cell "only" found, test for defined pairs (DIV id -> class name)
						// means to bypass code this code
						if (cell_current.className.indexOf(only.div[obj.id]) === -1) {
							// if old location exists then assign old location
							if ((table_old !== null && row_old !== null && cell_old !== null)) {
								table = table_old;
								row = row_old;
								cell = cell_old;
							}
							break;
						}
					}
					// DIV objects marked with "only" can't be placed to other cells (if property "other" is "deny")
					else if (only.div[obj.id] !== undefined && only.other === 'deny') {
						// if old location exists then assign old location
						if ((table_old !== null && row_old !== null && cell_old !== null)) {
							table = table_old;
							row = row_old;
							cell = cell_old;
						}
						break;
					}
					else {
						// search for 'mark' class name
						mark_found = cell_current.className.indexOf(REDIPS.drag.mark.cname) > -1 ? true : false;
						// if current cell is marked and access type is 'deny' or current cell isn't marked and access type is 'allow'
						// then return previous location
						if ((mark_found === true && REDIPS.drag.mark.action === 'deny') || (mark_found === false && REDIPS.drag.mark.action === 'allow')) {
							// marked cell found, but make exception if defined pairs (DIV id -> class name) exists
							// means to bypass code this code
							if (cell_current.className.indexOf(mark.exception[obj.id]) === -1) {
								// if old location exists then assign old location
								if ((table_old !== null && row_old !== null && cell_old !== null)) {
									table = table_old;
									row = row_old;
									cell = cell_old;
								}
								break;
							}
						}
					}
				}
				// test if current cell is defined as single
				single_cell = cell_current.className.indexOf('single') > -1 ? true : false;
				// if drop_option == single or current cell is single and current cell has child nodes then test if cell is occupied
				if ((REDIPS.drag.drop_option === 'single' || single_cell) && cell_current.childNodes.length > 0) {
					// if cell has only one node and that is text node then break - because this is empty cell
					if (cell_current.childNodes.length === 1 && cell_current.firstChild.nodeType === 3) {
						break;
					}
					// define and set has_content flag to false
					has_content = false;
					// open loop for each child node and jump out if 'drag' className found
					for (i = cell_current.childNodes.length - 1; i >= 0; i--) {
						if (cell_current.childNodes[i].className && cell_current.childNodes[i].className.indexOf('drag') > -1) {
							has_content = true;
							break;
						}
					}
					// if cell has content and old position exists ...
					if (has_content && table_old !== null && row_old !== null && cell_old !== null) {
						// .. and current position is different then source position then return previous position
						if (table_source !== table || row_source !== row || cell_source !== cell) {
							table = table_old;
							row = row_old;
							cell = cell_old;
							break;
						}
					}
				}
				// break table loop
				break;
			}
		}
	};



	// function sets color for the current table cell and remembers previous location and color
	// (it's called twice in handler_onmousemove)
	set_color = function () {
		// in case if ordinary element is placed inside 'deny' table cell
		if (table < tables.length && table !== null && row !== null && cell !== null) {
			// remember background color before setting the new background color
			bgcolor_old = tables[table].rows[row].cells[cell].style.backgroundColor;
			// set background color to the current table cell
			tables[table].rows[row].cells[cell].style.backgroundColor = REDIPS.drag.hover_color;
			// remember current position (for table, row and cell)
			table_old = table;
			row_old = row;
			cell_old = cell;
		}
	};



	// function returns array of box bounds (offset) top, right, bottom, left
	// used in calculate_cells and onmousedown event handler
	// type defines if function will include scrollLeft / scrollTop (needed for scrollable container calculation in calculate_cells)
	box_offset = function (box, position, box_scroll) {
		var scrollPosition,	// get scroll position
			oLeft = 0,		// define offset left (take care of horizontal scroll position)
			oTop  = 0,		// define offset top (take care od vertical scroll position)
			box_old = box;	// remember box object
		// if table_position is undefined, '' or 'page_scroll' then include page scroll offset
		if (position !== 'fixed') {
			scrollPosition = getScrollPosition();	// get scroll position
			oLeft = 0 - scrollPosition[0];			// define offset left (take care of horizontal scroll position)
			oTop  = 0 - scrollPosition[1];			// define offset top (take care od vertical scroll position)
		}
		// climb up through DOM hierarchy (getScrollPosition() takes care about page scroll positions)
		if (box_scroll === undefined || box_scroll === true) {
			do {
				oLeft += box.offsetLeft - box.scrollLeft;
				oTop += box.offsetTop - box.scrollTop;
				box = box.offsetParent;
			}
			while (box && box.nodeName !== 'BODY');
		}
		// climb up to the BODY element but without scroll positions
		else {
			do {
				oLeft += box.offsetLeft;
				oTop += box.offsetTop;
				box = box.offsetParent;
			}
			while (box && box.nodeName !== 'BODY');
		}
		// return box offset array
		//        top                 right,                     bottom           left
		return [ oTop, oLeft + box_old.offsetWidth, oTop + box_old.offsetHeight, oLeft ];
	};



	// calculates table row offsets (cells dimensions) and save to the tables array
	calculate_cells = function () {
		var i, j,		// local variables used in loops
			row_offset,	// row box
			position,	// if element (table or table container) has position:fixed then "page scroll" offset should not be added
			cb;			// box offset for container box (cb)
		// open loop for each HTML table inside id=drag (table array is initialized in init() function)
		for (i = 0; i < tables.length; i++) {
			// initialize row_offset array
			row_offset = [];
			// set table style position (to exclude "page scroll" offset from calculation if needed)
			position = get_style(tables[i], 'position');
			// if table doesn't have style position:fixed then table container should be tested
			if (position !== 'fixed') {
				position = get_style(tables[i].parentNode, 'position');
			}
			// backward loop has better perfomance
			for (j = tables[i].rows.length - 1; j >= 0; j--) {
				row_offset[j] = box_offset(tables[i].rows[j], position);
			}
			// save table informations (table offset and row offsets)
			tables[i].offset     = box_offset(tables[i], position);
			tables[i].row_offset = row_offset;
		}
		// calculate box offset for the div id=drag
		div_box = box_offset(div_drag);
		// update scrollable container areas if needed
		for (i = 0; i < scrollable_container.length; i++) {
			// set container box style position (to exclude page scroll offset from calculation if needed)
			position = get_style(scrollable_container[i].div, 'position');
			// get DIV container offset with or without "page scroll" and excluded scroll position of the content
			cb = box_offset(scrollable_container[i].div, position, false);
			// prepare scrollable container areas
			scrollable_container[i].offset = cb;
			scrollable_container[i].midstX = (cb[1] + cb[3]) / 2;
			scrollable_container[i].midstY = (cb[0] + cb[2]) / 2;
		}
	};



	// function returns scroll positions in array
	getScrollPosition = function () {
		// define local scroll position variables
		var scrollX, scrollY;
		// Netscape compliant
		if (typeof(window.pageYOffset) === 'number') {
			scrollX = window.pageXOffset;
			scrollY = window.pageYOffset;
		}
		// DOM compliant
		else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
			scrollX = document.body.scrollLeft;
			scrollY = document.body.scrollTop;
		}
		// IE6 standards compliant mode
		else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
			scrollX = document.documentElement.scrollLeft;
			scrollY = document.documentElement.scrollTop;
		}
		// needed for IE6 (when vertical scroll bar was on the top)
		else {
			scrollX = scrollY = 0;
		}
		// return scroll positions
		return [ scrollX, scrollY ];
	};



	// horizontal auto scroll function
	// input parameter is scroll object - "so" (window or DIV element)
	autoscrollX = function (so) {
		var pos,			// left style position
			old,			// old window scroll position (needed for window scrolling)
			scrollPosition,	// define current scroll position
			maxsp,			// maximum scroll position
			edgeCrossed,	// crossed edge for window and scrollable container
			X = pointer.x,	// define pointer X position
			Y = pointer.y;	// define pointer Y position
		// if mouseup then stop handling "current cell"
		if (edge.flag.x > 0) {
			// calculate cell (autoscroll is working)
			calculate_cells();
			// set current table row and table cell
			set_trc();
			// set current table, row and cell if mouse pointer is inside DIV id="drag"
			if (X < div_box[1] && X > div_box[3] && Y < div_box[2] && Y > div_box[0]) {
				cell_changed();
			}
		}
		// save scroll object to the global variable for the first call from handler_onmousemove
		// recursive calls will not enter this code and reference to the scroll_object will be preserved
		if (typeof(so) === 'object') {
			scroll_object = so;
		}
		// window autoscroll (define current, old and maximum scroll position)
		if (scroll_object === window) {
			scrollPosition = old = getScrollPosition()[0];
			maxsp = scroll_width - window_width;
			edgeCrossed = edge.page.x;
		}
		// scrollable container (define current and maximum scroll position)
		else {
			scrollPosition = scroll_object.scrollLeft;
			maxsp = scroll_object.scrollWidth - scroll_object.clientWidth;
			edgeCrossed = edge.div.x;
		}
		// if scrolling is possible
		if (edge.flag.x > 0 && ((edgeCrossed < 0 && scrollPosition > 0) || (edgeCrossed > 0 && scrollPosition < maxsp))) {
			// if object is window
			if (scroll_object === window) {
				// scroll window
				window.scrollBy(edgeCrossed, 0);
				// get new window scroll position (after scrolling)
				// because at page top or bottom edgeY can be bigger then the rest of scrolling area
				// it will be nice to know how much was window scrolled after scrollBy command
				scrollPosition = getScrollPosition()[0];
				// get current object top style
				pos = parseInt(obj.style.left, 10);
				if (isNaN(pos)) {
					pos = 0;
				}
			}
			// or scrollable container
			else {
				scroll_object.scrollLeft += edgeCrossed;
			}
			// recursive autoscroll call
			setTimeout(REDIPS.drag.autoscrollX, REDIPS.drag.speed);
		}
		// autoscroll is ended: element is out of the page edge or maximum position is reached (left or right)
		else {
			// return onscroll event handler (to window or div element)
			REDIPS.event.add(scroll_object, 'scroll', calculate_cells);
			// reset auto scroll flag X
			edge.flag.x = 0;
			// reset current cell position
			currentCell = [0, 0, 0, 0];
		}
	};



	// vertical auto scroll function
	// input parameter is scroll object - "so" (window or DIV element)
	autoscrollY = function (so) {
		var pos,			// top style position
			old,			// old window scroll position (needed for window scrolling)
			scrollPosition,	// define current scroll position
			maxsp,			// maximum scroll position
			edgeCrossed,	// crossed edge for window and scrollable container
			X = pointer.x,	// define pointer X position
			Y = pointer.y;	// define pointer Y position
		// if mouseup then stop handling "current cell"
		if (edge.flag.y > 0) {
			// calculate cell (autoscroll is working)
			calculate_cells();
			// set current table row and table cell
			set_trc();
			// set current table, row and cell if mouse pointer is inside DIV id="drag"
			if (X < div_box[1] && X > div_box[3] && Y < div_box[2] && Y > div_box[0]) {
				cell_changed();
			}
		}
		// save scroll object to the global variable for the first call from handler_onmousemove
		// recursive calls will not enter this code and reference to the scroll_object will be preserved
		if (typeof(so) === 'object') {
			scroll_object = so;
		}
		// window autoscroll (define current, old and maximum scroll position)
		if (scroll_object === window) {
			scrollPosition = old = getScrollPosition()[1];
			maxsp = scroll_height - window_height;
			edgeCrossed = edge.page.y;
		}
		// scrollable container (define current and maximum scroll position)
		else {
			scrollPosition = scroll_object.scrollTop;
			maxsp = scroll_object.scrollHeight - scroll_object.clientHeight;
			edgeCrossed = edge.div.y;
		}
		// if scrolling is possible
		if (edge.flag.y > 0 && ((edgeCrossed < 0 && scrollPosition > 0) || (edgeCrossed > 0 && scrollPosition < maxsp))) {
			// if object is window
			if (scroll_object === window) {
				// scroll window
				window.scrollBy(0, edgeCrossed);
				// get new window scroll position (after scrolling)
				// because at page top or bottom edgeY can be bigger then the rest of scrolling area
				// it will be nice to know how much was window scrolled after scrollBy command
				scrollPosition = getScrollPosition()[1];
				// get current object top style
				pos = parseInt(obj.style.top, 10);
				if (isNaN(pos)) {
					pos = 0;
				}
			}
			// or scrollable container
			else {
				scroll_object.scrollTop += edgeCrossed;
			}
			// recursive autoscroll call
			setTimeout(REDIPS.drag.autoscrollY, REDIPS.drag.speed);
		}
		// autoscroll is ended: element is out of the page edge or maximum position is reached (top or bottom)
		else {
			// return onscroll event handler (to window or div element)
			REDIPS.event.add(scroll_object, 'scroll', calculate_cells);
			// reset auto scroll flag Y
			edge.flag.y = 0;
			// reset current cell position
			currentCell = [0, 0, 0, 0];
		}
	};



	// clone object
	clone_object = function () {
		var obj_new = obj.cloneNode(true),	// clone object
			offset,							// offset of the original object
			offset_dragged;					// offset of the new object (cloned)
		// append cloned element to the DIV id="obj_new"
		document.getElementById('obj_new').appendChild(obj_new);
		// get IE (all versions) to allow dragging outside the window (?!)
		// this was needed here also -  despite setCaputure in onmousedown
		if (obj_new.setCapture) {
			obj_new.setCapture();
		}
		// set high z-index
		obj_new.style.zIndex = 999;
		// set position style to "fixed"
		obj_new.style.position = 'fixed';
		// define offset for original and cloned element
		offset = box_offset(obj);
		offset_dragged = box_offset(obj_new);
		// calculate top and left offset of the new object
		obj_new.style.top   = (offset[0] - offset_dragged[0]) + "px";
		obj_new.style.left  = (offset[3] - offset_dragged[3]) + "px";
		// set onmouse down event for the new object
		obj_new.onmousedown = handler_onmousedown;
		// remove clone from the class name of the new object
		obj_new.className = obj_new.className.replace('clone', '');
		// if counter is undefined, set 0
		if (cloned_id[obj.id] === undefined) {
			cloned_id[obj.id] = 0;
		}
		// set id for cloned element (append id of "clone" element - tracking the origin)
		// id is separated with "c" ("_" is already used to compound id, table, row and column)
		obj_new.id = obj.id + 'c' + cloned_id[obj.id];
		// increment cloned_id for cloned element
		cloned_id[obj.id] += 1;
		// I assumed that custom properties will be automatically cloned - but not(?!)
		obj_new.redips_container = obj.redips_container;
		obj_new.redips_enabled = obj.redips_enabled;
		// remember previous object (this is clone object)
		REDIPS.drag.obj_old = obj_old = obj;
		// set reference to the cloned object
		REDIPS.drag.obj = obj = obj_new;
	};



	// after cloning object, take care about climit1_X or climit2_X classnames
	// function is called from handler_onmouseup
	// obj_old is reference to the clone object not cloned
	clone_limit = function () {
		// declare local variables
		var match_arr,	// match array
			limit_type,	// limit type (1 - clone becomes "normal" drag element atlast; 2 - clone element stays immovable)
			limit,		// limit number
			classes;	// class names of clone element
		// set classes of clone object
		classes = obj_old.className;
		// match climit class name
		match_arr = classes.match(/climit(\d)_(\d+)/);
		// if class name contains climit option
		if (match_arr !== null) {
			// prepare limit_type (1 or 2) and limit
			limit_type = parseInt(match_arr[1], 10);
			limit = parseInt(match_arr[2], 10);
			// decrease limit number and cut out "climit" class
			limit -= 1;
			classes = classes.replace(/climit\d_\d+/g, '');
			// test if limit drop to zero
			if (limit <= 0) {
				// no more cloning, cut "clone" from class names
				classes = classes.replace('clone', '');
				// if limit type is 2 then clone object becomes immovable
				if (limit_type === 2) {
					// cut "drag" class
					classes = classes.replace('drag', '');
					// remove onmousedown event handler
					obj_old.onmousedown = null;
					// set cursor style to auto
					obj_old.style.cursor = 'auto';
					// call myhandler_clonedend2 handler
					REDIPS.drag.myhandler_clonedend2();
				}
				else {
					// call myhandler_clonedend1 handler
					REDIPS.drag.myhandler_clonedend1();
				}
			}
			// return "climit" class but with decreased limit_number
			else {
				classes = classes + ' climit' + limit_type + '_' + limit;
			}
			// normalize spaces and return classes to the clone object
			classes = classes.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
			obj_old.className = classes;
		}
	};



	// function returns true or false if element needs to have control
	// true - click on element will not start dragging (element has its own control)
	// false - click on element will start dragging
	elementControl = function (evt) {
		// declare elementControl flag, source tag name and element classes
		var flag = false,
			srcName,
			classes,						// class names of DIV element;
			regex_nodrag = /\bnodrag\b/i;	// regular expression to search "nodrag" class name
		// set source tag name and classes for IE and FF
		if (evt.srcElement) {
			srcName = evt.srcElement.tagName;
			classes = evt.srcElement.className;
		}
		else {
			srcName = evt.target.tagName;
			classes = evt.target.className;
		}
		// set flag (true or false) for clicked elements
		switch (srcName) {
		case 'A':
		case 'INPUT':
		case 'SELECT':
		case 'OPTION':
		case 'TEXTAREA':
			flag = true;
			break;
		// none of form elements
		default:
			// if element has "nodrag" class name then dragging will be skipped
			if (regex_nodrag.test(classes)) {
				flag = true;
			}
			else {
				flag = false;
			}
		}
		// return flag flag
		return flag;
	};



	// delete DIV object
	trash_delete = function () {
		var div_text = 'element',	// div content (inner text)
			border;					// border color (green or blue)
		// find the border color of DIV element (t1 - green, t2 - blue, t3 - orange)
		if (obj.className.indexOf('t1') > 0) {
			border = 'green';
		}
		else if (obj.className.indexOf('t2') > 0) {
			border = 'blue';
		}
		else {
			border = 'orange';
		}
		// set div text (cross browser)
		if (obj.getElementsByTagName('INPUT').length || obj.getElementsByTagName('SELECT').length) {
			div_text = 'form element';
		}
		else if (obj.innerText || obj.textContent) {
			div_text = '"' + (obj.innerText || obj.textContent) + '"';
		}
		// ask if user is sure
		if (confirm('Delete ' + div_text + ' (' + border + ') from\n table ' + table_source + ', row ' + row_source + ' and column ' + cell_source + '?')) {
			// yes, user is sure only call myhandler_deleted function
			REDIPS.drag.myhandler_deleted();
			// if object is cloned, update climit1_X or climit2_X classname
			if (cloned_flag === 1) {
				clone_limit();
			}
		}
		// user is unsure - do undelete
		else {
			// undelete ordinary movable element
			if (cloned_flag !== 1) {
				// append removed object to the source table cell
				tables[table_source].rows[row_source].cells[cell_source].appendChild(obj);
				// and recalculate table cells because undelete can change row dimensions
				calculate_cells();
			}
			// call undeleted handler
			REDIPS.drag.myhandler_undeleted();
		}
	};



	// function attached / detached onmousedown event and attaches onscroll event for DIV elements
	// first parameter can be (string)'init', (boolean)true or (boolean)false
	// if first parameter is (string)'init' and second parameter isn't defined then DIV elements will be enabled and onscroll attached to the DIV class="scroll"
	// if first parameter is (boolean)true or (boolean)false and second parameter isn't defined then DIV elements will be enabled / disabled
	// second parameter is optional and defines particular DIV element to enable / disable
	enable_drag = function (enable_flag, div_id) {
		// define local variables
		var i, j, k,		// local variables used in loop
			divs = [],		// collection of div elements contained in tables or one div element
			tbls = [],		// collection of tables inside scrollable container
			borderStyle,	// border style (solid or dotted)
			cursor,			// cursor style (move or auto)
			overflow,		// css value of overflow property
			autoscroll,		// boolean - if scrollable container will have autoscroll option (default is true)
			enabled,		// enabled property (true or false)
			cb,				// box offset for container box (cb)
			handler,		// onmousedown or null event handler
			position,		// if table container has position:fixed then "page scroll" offset should not be added
			regex_drag = /\bdrag\b/i,	// regular expression to search "drag" class name
			regex_noautoscroll = /\bnoautoscroll\b/i;	// regular expression to search "noautoscroll" class name
		// define onmousedown handler and styles or null
		if (enable_flag === true || enable_flag === 'init') {
			handler = handler_onmousedown;
			borderStyle = REDIPS.drag.border;
			cursor = 'move';
			enabled = true;
		}
		else {
			handler = null;
			borderStyle = REDIPS.drag.border_disabled;
			cursor = 'auto';
			enabled = false;
		}
		// collect all DIV elements
		if (div_id === undefined) {
			// collect div elements inside DIV id="drag" (drag elements and scrollable containers)
			divs = div_drag.getElementsByTagName('div');
		}
		// or prepare array with only one div element
		else {
			divs[0] = document.getElementById(div_id);
		}
		// attach onmousedown event handler only to DIV elements that have "drag" in class name
		// allow other div elements inside <div id="drag" ...
		for (i = 0, j = 0; i < divs.length; i++) {
			if (regex_drag.test(divs[i].className)) {
				// DIV elements should have only onmousedown attached so here will be used
				// traditional event registration model
				// using advanced model has problems with text selection and dragging text selection
				divs[i].onmousedown = handler;
				divs[i].style.borderStyle = borderStyle;
				divs[i].style.cursor = cursor;
				// add enabled property to the DIV element (true or false)
				divs[i].redips_enabled = enabled;
				// add reference to the DIV container (needed for table initialization)
				divs[i].redips_container = div_drag;
			}
			// attach onscroll event to the DIV element in init phase only if DIV element has overwflow other than default value 'visible'
			// and that means scrollable DIV container
			else if (enable_flag === 'init') {
				// ask for overflow style
				overflow = get_style(divs[i], 'overflow');
				// if DIV is scrollable
				if (overflow !== 'visible') {
					// define onscroll event handler for scrollable container
					REDIPS.event.add(divs[i], 'scroll', calculate_cells);
					// set container box style position (to exclude page scroll offset from calculation if needed)
					position = get_style(divs[i], 'position');
					// get DIV container offset with or without "page scroll" and excluded scroll position of the content
					cb = box_offset(divs[i], position, false);
					// search for noautoscroll option
					if (regex_noautoscroll.test(divs[i].className)) {
						autoscroll = false;
					}
					else {
						autoscroll = true;
					}
					// prepare scrollable container areas
					scrollable_container[j] = {
						div			: divs[i],				// reference to the scrollable container
						offset		: cb,					// box offset of the scrollable container
						midstX		: (cb[1] + cb[3]) / 2,	// middle X
						midstY		: (cb[0] + cb[2]) / 2,	// middle Y
						autoscroll	: autoscroll			// autoscroll enabled or disabled (true or false)
					};
					// search for tables inside scrollable container
					tbls = divs[i].getElementsByTagName('table');
					// loop goes through found tables inside scrollable area
					for (k = 0; k < tbls.length; k++) {
						// add a reference to the corresponding scrollable area
						tbls[k].sca = scrollable_container[j];
					}
					// increase scrollable container counter
					j++;
				}
			}
		}
	};



	// function returns style value of requested object and style name
	// http://www.quirksmode.org/dom/getstyles.html
	get_style = function (el, style_name) {
		var val; // value of requested object and property
		if (el.currentStyle) {
			val = el.currentStyle[style_name];
		}
		else if (window.getComputedStyle) {
			val = document.defaultView.getComputedStyle(el, null).getPropertyValue(style_name);
		}
		return val;
	};



	// scan table content
	// table ordinal defines table to scan (so it could be first, second, third table ...)
	// if input parameter is not defined, function will prepare parameters for all tables
	save_content = function (tbl) {
		var query = '',		// define query parameter
			tbl_start,		// table loop starts from tbl_start parameter
			tbl_end,		// table loop ends on tbl_end parameter
			tbl_rows,		// number of table rows
			cells,			// number of cells in the current row
			tbl_cell,		// reference to the table cell
			t, r, c, d;		// variables used in for loops
		// first sort tables array to it's original order
		tables.sort(function (a, b) {
			return a.redips_idx - b.redips_idx;
		});
		// if input parameter is undefined, then method will return content from all tables
		if (tbl === undefined) {
			tbl_start = 0;
			tbl_end = tables.length - 1;
		}
		// if input parameter is out of range then method will return content from first table
		else if (tbl < 0 || tbl > tables.length - 1) {
			tbl_start = tbl_end = 0;
		}
		// else return content from specified table
		else {
			tbl_start = tbl_end = tbl;
		}
		// iterate through tables
		for (t = tbl_start; t <= tbl_end; t++) {
			// define number of table rows
			tbl_rows = tables[t].rows.length;

			// iterate through each table row
			for (r = 0; r < tbl_rows; r++) {
				// set the number of cells in the current row
				cells = tables[t].rows[r].cells.length;
				// iterate through each table cell
				for (c = 0; c < cells; c++) {
					// set reference to the table cell
					tbl_cell = tables[t].rows[r].cells[c];
					// if cells isn't empty (no matter is it allowed or denied table cell)
					if (tbl_cell.childNodes.length > 0) {
						// cell can contain many DIV elements
						for (d = 0; d < tbl_cell.childNodes.length; d++) {
							// childNodes should be DIVs, not \n childs
							if (tbl_cell.childNodes[d].tagName === 'DIV') { // and yes, it should be uppercase
								query += 'p[]=' + tbl_cell.childNodes[d].id + '_' + t + '_' + r + '_' + c + '&';
							}
						}
					}
				}
			}
		}
		// cut last '&' from query string
		query = query.substring(0, query.length - 1);
		// sort "clean" tables and nested tables to the array top (otherwise nested tables will not work after saving content)
		tables.sort(function (a, b) {
			return b.redips_tableType - a.redips_tableType;
		});
		// return prepared parameters (if tables are empty, returned value could be empty too)
		return query;
	};



	// if input parameter is not defined, function will prepare parameters for the first table
	move_object = function (from, to) {
		var i, // local variable
			childnodes_length; // number of child nodes
		// test if "from" cell is equal to "to" cell then do nothing
		if (from === to) {
			return;
		}
		// define childnodes length before loop (not in loop because NodeList objects in the DOM are live)
		childnodes_length = from.childNodes.length;
		// loop through all child nodes
		for (i = 0; i < childnodes_length; i++) {
			to.appendChild(from.childNodes[0]); // '0', not 'i' because NodeList objects in the DOM are live
		}
	};


	//
	// public properties and methods
	//

	return {
		obj					: obj,				// (object) moved object
		obj_old				: obj_old,			// (object) previously moved object (before clicked or cloned)
		source_cell			: source_cell,		// (object) source table cell (defined in onmousedown)
		previous_cell		: previous_cell,	// (object) previous table cell (defined in onmousemove)
		current_cell		: current_cell,		// (object) current table cell (defined in onmousemove)
		target_cell			: target_cell,		// (object) target table cell (defined in onmouseup)
		hover_color			: hover_color,		// (string) hover color
		bound				: bound,			// (integer) bound width for autoscroll
		speed				: speed,			// (integer) scroll speed in milliseconds
		only				: only,				// (object) table cells marked with "only" can accept defined DIV elements
		mark				: mark,				// (object) table cells marked with "mark" can be allowed or denied (with exceptions)
		border				: border,			// (string) border style for enabled element
		border_disabled		: border_disabled,	// (string) border style for disabled element
		trash				: trash,			// (string) cell class name where draggable element will be destroyed
		trash_ask			: trash_ask,		// (boolean) confirm object deletion (ask a question "Are you sure?" before delete)
		drop_option			: drop_option,		// (string) drop_option has three options: multiple, single and switch
		delete_cloned		: delete_cloned,	// (boolean) delete cloned div if the cloned div is dragged outside of any table
		cloned_id			: cloned_id,		// (array) needed for increment ID of cloned elements
		clone_shiftKey		: clone_shiftKey,	// (boolean) if true, elements could be cloned with pressed SHIFT key

		// assign public pointers
		init				: init,
		enable_drag			: enable_drag,
		save_content		: save_content,
		move_object			: move_object,		// move object from source cell to the target cell (source and target cells are input parameters)

		// autoscroll should be public because of setTimeout recursive call in autoscroll
		autoscrollX			: autoscrollX,
		autoscrollY			: autoscrollY,

		// needed for setting onmousedown event in myhandler actions
		handler_onmousedown	: handler_onmousedown,

		/*
		 * Action handlers
		 * Each handler sees REDIPS.drag.obj, REDIPS.drag.obj_old, REDIPS.drag.target_cell ... reference
		 * Note: for the first dragging, REDIPS.drag.obj_old === REDIPS.drag.obj because REDIPS.drag.obj_old does not exist yet
		 */
		myhandler_clicked		: function () {},
		myhandler_moved			: function () {},
		myhandler_notmoved		: function () {},
		myhandler_dropped		: function () {},
		myhandler_switched		: function () {},
		myhandler_changed		: function () {},
		myhandler_cloned		: function () {},
		myhandler_clonedend1	: function () {},
		myhandler_clonedend2	: function () {},
		myhandler_notcloned		: function () {},
		myhandler_deleted		: function () {},
		myhandler_undeleted		: function () {}

	}; // end of public (return statement)

}());




// if REDIPS.event isn't already defined (from other REDIPS file)
if (!REDIPS.event) {
	REDIPS.event = (function () {
		var add,	// add event listener
			remove;	// remove event listener

		// http://msdn.microsoft.com/en-us/scriptjunkie/ff728624
		// http://www.javascriptrules.com/2009/07/22/cross-browser-event-listener-with-design-patterns/

		// add event listener
		add = function (obj, eventName, handler) {
			if (obj.addEventListener) {
				obj.addEventListener(eventName, handler, false);
			}
			else if (obj.attachEvent) {
				obj.attachEvent('on' + eventName, handler);
			}
			else {
				obj['on' + eventName] = handler;
			}
		};

		// remove event listener
		remove = function (obj, eventName, handler) {
			if (obj.removeEventListener) {
				obj.removeEventListener(eventName, handler, false);
			}
			else if (obj.detachEvent) {
				obj.detachEvent('on' + eventName, handler);
			}
			else {
				obj['on' + eventName] = null;
			}
		};

		return {
			add		: add,
			remove	: remove
		}; // end of public (return statement)

	}());
}
