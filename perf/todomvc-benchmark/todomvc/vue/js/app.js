/*global Vue, todoStorage */

(function (exports) {

	'use strict';

	var filters = {
		all: function (todo) {
			return true;
		},
		active: function (todo) {
			return !todo.completed;
		},
		completed: function (todo) {
			return todo.completed;
		}
	};

	exports.app = new Vue({

		// the root element that will be compiled
		el: '#todoapp',

		// data
		data: {
			todos: todoStorage.fetch(),
			newTodo: '',
			editedTodo: null,
			filter: 'all'
		},

		ready: function () {
			this.$watch('todos', function (todos) {
				todoStorage.save(todos);
			});
		},

		// a custom directive to wait for the DOM to be updated
		// before focusing on the input field.
		// http://vuejs.org/guide/directives.html#Writing_a_Custom_Directive
		directives: {
			'todo-focus': function (value) {
				if (!value) {
					return;
				}
				var el = this.el;
				setTimeout(function () {
					el.focus();
				}, 0);
			}
		},

		filters: {
			filterTodos: function (todos) {
				return todos.filter(filters[this.filter]);
			}
		},

		// computed property
		// http://vuejs.org/guide/computed.html
		computed: {
			remaining: function () {
				return this.todos.filter(filters.active).length;
			},
			allDone: {
				$get: function () {
					return this.remaining === 0;
				},
				$set: function (value) {
					this.todos.forEach(function (todo) {
						todo.completed = value;
					});
				}
			}
		},

		// methods that implement data logic.
		// note there's no DOM manipulation here at all.
		methods: {

			addTodo: function () {
				var value = this.newTodo && this.newTodo.trim();
				if (!value) {
					return;
				}
				this.todos.push({ title: value, completed: false });
				this.newTodo = '';
			},

			removeTodo: function (todo) {
				this.todos.$remove(todo.$data);
			},

			editTodo: function (todo) {
				this.beforeEditCache = todo.title;
				this.editedTodo = todo;
			},

			doneEdit: function (todo) {
				if (!this.editedTodo) {
					return;
				}
				this.editedTodo = null;
				todo.title = todo.title.trim();
				if (!todo.title) {
					this.removeTodo(todo);
				}
			},

			cancelEdit: function (todo) {
				this.editedTodo = null;
				todo.title = this.beforeEditCache;
			},
			
			removeCompleted: function () {
				this.todos = this.todos.filter(filters.active);
			}
		}
	});

	app.filters = filters;

})(window);