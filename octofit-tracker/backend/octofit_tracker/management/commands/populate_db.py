from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard
from django.utils import timezone

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Drop all collections to avoid cascade deletion issues with Djongo
        from pymongo import MongoClient
        client = MongoClient('mongodb://localhost:27017/')
        db = client['octofit_db']
        db.drop_collection('octofit_tracker_activity')
        db.drop_collection('octofit_tracker_user')
        db.drop_collection('octofit_tracker_team')
        db.drop_collection('octofit_tracker_workout')
        db.drop_collection('octofit_tracker_leaderboard')
        db.drop_collection('octofit_tracker_workout_suggested_for')

        # Create teams
        marvel = Team.objects.create(name='Marvel', description='Marvel superheroes')
        dc = Team.objects.create(name='DC', description='DC superheroes')

        # Create users
        users = [
            User.objects.create(name='Spider-Man', email='spiderman@marvel.com', team=marvel),
            User.objects.create(name='Iron Man', email='ironman@marvel.com', team=marvel),
            User.objects.create(name='Wonder Woman', email='wonderwoman@dc.com', team=dc),
            User.objects.create(name='Batman', email='batman@dc.com', team=dc),
        ]

        # Create workouts
        pushups = Workout.objects.create(name='Pushups', description='Do 20 pushups')
        running = Workout.objects.create(name='Running', description='Run 5km')
        pushups.suggested_for.add(marvel, dc)
        running.suggested_for.add(marvel, dc)

        # Create activities
        Activity.objects.create(user=users[0], type='pushups', duration=10, date=timezone.now().date())
        Activity.objects.create(user=users[1], type='running', duration=30, date=timezone.now().date())
        Activity.objects.create(user=users[2], type='pushups', duration=15, date=timezone.now().date())
        Activity.objects.create(user=users[3], type='running', duration=25, date=timezone.now().date())

        # Create leaderboards
        Leaderboard.objects.create(team=marvel, points=100)
        Leaderboard.objects.create(team=dc, points=90)

        self.stdout.write(self.style.SUCCESS('Test data created for octofit_db!'))
