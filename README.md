# web_x2many_selectable
This widget adds the capability for selecting multiple records in x2many fields and calls a python function with the ids as argument.

Its really easy to use, just add **widget=x2many_selectable** on any x2many field.

e.g.

~~~~.html
<field name="course_id" widget="x2many_selectable"
            actions='[
               {"name": "bulk_action1", "string": "Acción 1"},
               {"name": "bulk_action2", "string": "Acción 2", "separator": "1"},
               {"name": "bulk_action3", "string": "Acción 3"},
               {"name": "bulk_action4", "string": "Acción 4"}
             ]'>
        <tree>
            <field name="title" />
        </tree>
    </field>
~~~~

You can get the selected records in python function, a smple python function is as follows:

~~~~{.python}
@api.multi
def bulk_action1(self):
    print 'bulk_action1'
    for record in self:
        print record

@api.multi
def bulk_action2(self):
    print 'bulk_action2'
    for record in self:
        print record

@api.multi
def bulk_action3(self):
    print 'bulk_action3'
    for record in self:
        print record
        
@api.multi
def bulk_action4(self):
    print 'bulk_action4'
    for record in self:
        print record
~~~~

By default the widget will pick model from x2many field and default function name is "bulk_verify".
You can change the model as well as python function name from javascript.
