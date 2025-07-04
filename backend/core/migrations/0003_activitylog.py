# Generated by Django 5.2.3 on 2025-06-30 15:43

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_project_task'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActivityLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('previous_status', models.CharField(blank=True, choices=[('todo', 'Todo'), ('in_progress', 'In Progress'), ('done', 'Done')], max_length=20, null=True)),
                ('previous_due_date', models.DateField(blank=True, null=True)),
                ('previous_assignee', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('task', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='activity_log', to='core.task')),
            ],
        ),
    ]
